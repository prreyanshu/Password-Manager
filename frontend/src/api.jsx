import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getAuthHeader = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  return 'Basic ' + btoa(`${username}:${password}`);
};

export const register = async (user) => {
  try {
    const response = await api.post('/register', user);
    localStorage.setItem('username', user.username);
    localStorage.setItem('password', user.password);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const login = async (user) => {
  try {
    const response = await api.post('/login', user);
    localStorage.setItem('username', user.username);
    localStorage.setItem('password', user.password);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const getPasswords = async () => {
  try {
    const response = await api.get('/passwords', {
      headers: { Authorization: getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }
};

export const savePassword = async (passwordData, isEdit = false) => {
  try {
    if (isEdit && passwordData._id) {
      // PATCH for updating note
      const response = await api.patch(
        `/passwords/${passwordData._id}`,
        { note: passwordData.note },
        {
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } else {
      // POST for creating new password
      const response = await api.post(
        '/generate-password',
        passwordData,
        {
          headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};
