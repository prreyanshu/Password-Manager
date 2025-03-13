import axios from 'axios';

const api = axios.create({
  baseURL: 'https://password-manager-snowy-eta.vercel.app',
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
  const response = await api.post('/register', user);
  localStorage.setItem('username', user.username);
  localStorage.setItem('password', user.password);
  return response.data;
};

export const login = async (user) => {
  const response = await api.post('/login', user);
  localStorage.setItem('username', user.username);
  localStorage.setItem('password', user.password);
  return response.data;
};

export const savePassword = async (password) => {
  const response = await api.post('/generate-password', password, {
    headers: { Authorization: getAuthHeader() },
  });
  return response.data;
};

export const getPasswords = async () => {
  const response = await api.get('/passwords', {
    headers: { Authorization: getAuthHeader() },
  });
  return response.data;
};
