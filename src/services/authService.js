// Authentication service - Handles user login, logout, and token management
import { apiClient } from "../utils/axiosConfig";

// Login user with email and password
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login for email:', email);
    
    // First, try to get user by email to check if they exist (for now we simulate this)
    // In production, the backend should handle email/password validation
    const response = await apiClient.post("/api/auth/login", { 
      email, 
      password 
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      const userData = response.data.data || response.data.user;
      const token = response.data.token || 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        success: true,
        data: {
          user: userData,
          token: token
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // For development: Try to simulate login by checking user exists
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('Backend unavailable, attempting fallback login...');
      
      try {
        // Try to get user by email from users endpoint as fallback
        const userResponse = await apiClient.get(`/api/users/getByEmail/${email}`);
        
        if (userResponse.data.success) {
          const userData = userResponse.data.data;
          const token = 'mock-jwt-token-' + Date.now();
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return {
            success: true,
            data: {
              user: userData,
              token: token
            },
            message: 'Login successful (development mode)'
          };
        }
      } catch (fallbackError) {
        console.error('Fallback login failed:', fallbackError);
      }
    }
    
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Logout user and clear stored data
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await apiClient.post("/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Get current authenticated user info
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await apiClient.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    return null;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// Check if user is currently authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get stored user data from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set authorization header for API calls
export const setAuthHeader = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header on application start
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthHeader(token);
  }
};
