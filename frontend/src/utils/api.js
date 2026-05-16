import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
