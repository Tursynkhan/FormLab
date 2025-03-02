import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL  || 'http://localhost:3000',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;