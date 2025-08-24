// User service - Handles all user-related API calls
import { apiClient } from '../utils/axiosConfig';

// Create a new user (worker or customer)
export const createUser = async (userData) => {
  try {
    console.log('🔄 Creating user with data:', userData);
    
    // Prepare the payload based on user role
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      gender: userData.gender,
      about: userData.about || '',
      phone: userData.phone,
      role: userData.role
    };

    // Add role-specific fields
    if (userData.role === 'worker') {
      payload.experience = userData.experience || 0;
      payload.hourlyRate = userData.hourlyRate || 0;
      payload.serviceAreas = userData.serviceAreas || '';
      payload.preferredLocation = userData.preferredLocation || '';
      // Note: userSkills will be added separately after user creation
    } else {
      payload.preferredLocation = userData.preferredLocation || '';
    }

    console.log('📤 Sending request to /users/create with payload:', payload);
    
    const response = await apiClient.post('/users/create', payload);
    
    console.log('📥 Received response:', response.data);
    
    if (response.data.success) {
      // If this is a worker with skills, add skills separately
      if (userData.role === 'worker' && userData.userSkills && userData.userSkills.length > 0) {
        try {
          console.log('🔄 Adding skills for worker:', userData.userSkills);
          const skillsResponse = await apiClient.post(
            `/user-skills/bulk-create/${response.data.data.userId}`,
            userData.userSkills
          );
          console.log('✅ Skills added successfully:', skillsResponse.data);
        } catch (skillsError) {
          console.error('❌ Error adding skills:', skillsError);
          // Don't fail the registration if skills fail to add
        }
      }
      
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create user');
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNREFUSED') {
      throw new Error('🔌 Cannot connect to backend server. Please make sure the Spring Boot server is running on http://localhost:8080');
    } else if (error.message.includes('CORS') || error.message.includes('preflight') || error.message.includes('OPTIONS')) {
      throw new Error('🌐 CORS Error: The backend server needs to be configured to allow requests from http://localhost:3000. Please check the backend CORS settings.');
    } else if (error.response?.status === 404) {
      throw new Error('🔍 API endpoint not found. Please check if the backend has the /users/create endpoint.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('❌ Failed to create user. Please check your network connection and try again.');
    }
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/getById/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await apiClient.get(`/users/getByEmail/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

// Update user profile
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get all users (for admin)
export const getAllUsers = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get(`/users/getAll?pageNumber=${page}&pageSize=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('userImage', imageFile);
    
    const response = await apiClient.post(`/users/uploadImage/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get profile image URL
export const getProfileImageUrl = (userId) => {
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/users/image/${userId}`;
};

// Legacy functions for backward compatibility
export const registerWorker = async (workerData) => {
  return createUser({ ...workerData, role: 'worker' });
};

export const registerCustomer = async (customerData) => {
  return createUser({ ...customerData, role: 'customer' });
};
