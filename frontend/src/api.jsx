import axios from 'axios';

const api = axios.create({
  baseURL: 'https://password-manager-seven-mauve.vercel.app/', // Ensure this is the correct deployed backend URL
});

const getAuthHeader = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  console.log('Stored credentials:', { username, password }); // Debugging log
  if (username && password) {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }
  return '';
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

export const savePassword = async (password) => {
  try {
    const response = await api.post('/generate-password', password, {
      headers: { Authorization: getAuthHeader() },
    });
    return response.data;
  } catch (error) {
    console.error('Error during savePassword:', error);
    throw error.response ? error.response.data : new Error('Save password failed');
  }
};

export const getPasswords = async () => {
  try {
    const response = await api.get('/passwords', {
      headers: { Authorization: getAuthHeader() },
    });
    return response.data;
  } catch (error) {
    console.error('Error during getPasswords:', error);
    throw error.response ? error.response.data : new Error('Get passwords failed');
  }
};
