import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
    (window.location.hostname.includes('vercel.app') ? 'https://auragems-api.vercel.app/api' : 'http://localhost:5050/api')
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('adminInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
