import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  // Point to our Express backend URL
  baseURL: 'http://localhost:5000/api',
  // MUST be true so that HTTP-Only cookies (our JWT) are sent with every request
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add interceptors here later to catch global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is 401 Unauthorized, we could automatically redirect to login
    return Promise.reject(error);
  }
);

export default api;