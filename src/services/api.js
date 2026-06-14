import axios from 'axios';

// Base URL of the backend API
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('chatUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// --- Auth endpoints ---
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// --- User endpoints ---
export const getUsers = () => api.get('/users');

// --- Message endpoints ---
export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessageRest = (data) => api.post('/messages', data);

export default api;
