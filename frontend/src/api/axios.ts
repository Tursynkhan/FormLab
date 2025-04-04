import axios from 'axios';

export const BASE_URL=import.meta.env.VITE_API_URL || 'http://localhost:3000';
const instance = axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export default instance;