// CORS configuration and testing utilities
import { apiClient } from './axiosConfig';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return {
      success: true,
      message: 'Backend connection successful',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Backend connection failed',
      error: error.message
    };
  }
};

// Diagnose CORS issues
export const diagnoseCORSIssue = async () => {
  try {
    // Test with different methods
    const tests = [
      { method: 'GET', url: '/api/health' },
      { method: 'POST', url: '/api/auth/login', data: { email: 'test@test.com', password: 'test' } }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        if (test.method === 'GET') {
          await apiClient.get(test.url);
          results.push({ ...test, success: true });
        } else if (test.method === 'POST') {
          await apiClient.post(test.url, test.data);
          results.push({ ...test, success: true });
        }
      } catch (error) {
        results.push({ 
          ...test, 
          success: false, 
          error: error.message,
          status: error.response?.status 
        });
      }
    }

    return {
      success: true,
      results,
      recommendations: getCORSRecommendations(results)
    };
  } catch (error) {
    return {
      success: false,
      message: 'CORS diagnosis failed',
      error: error.message
    };
  }
};

// Get CORS recommendations based on test results
const getCORSRecommendations = (results) => {
  const recommendations = [];
  
  results.forEach(result => {
    if (!result.success) {
      if (result.status === 0) {
        recommendations.push('Backend server is not running. Please start your Spring Boot application.');
      } else if (result.status === 404) {
        recommendations.push(`Endpoint ${result.url} not found. Check your backend routes.`);
      } else if (result.status === 403) {
        recommendations.push('CORS issue detected. Add CORS configuration to your backend.');
      } else if (result.status === 500) {
        recommendations.push('Backend server error. Check your backend logs.');
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('All tests passed. CORS is properly configured.');
  }

  return recommendations;
};

// Quick CORS test
export const quickCORSTest = async () => {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL || 'http://localhost:8080/api/health', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      status: response.status,
      message: 'CORS test successful'
    };
  } catch (error) {
    return {
      success: false,
      message: 'CORS test failed',
      error: error.message
    };
  }
};
