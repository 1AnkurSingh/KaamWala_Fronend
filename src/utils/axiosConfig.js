// Axios configuration - Sets up HTTP client with interceptors and base configuration
import axios from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
});

// Request interceptor - Adds auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handles common response scenarios
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error('Request failed with status:', error.response.status);
      }
    } else if (error.request) {
      // Request made but no response received (CORS, network issues)
      console.error('Network/CORS Error:', {
        message: error.message,
        code: error.code,
        request: error.request
      });
      
      // Handle specific network errors
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Backend server is not running on http://localhost:8080');
      } else if (error.message.includes('CORS')) {
        console.error('❌ CORS error - backend needs to allow requests from http://localhost:3000');
      } else {
        console.error('❌ Network error - check if backend is running and accessible');
      }
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Legacy export for backward compatibility
export default apiClient;
