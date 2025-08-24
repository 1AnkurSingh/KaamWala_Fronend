// Image service - Handles profile image upload and retrieval
import { apiClient } from '../utils/axiosConfig';

// Upload image to server
export const uploadImage = async (endpoint, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('userImage', imageFile);
    
    const response = await apiClient.post(endpoint, formData, {
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

// Get image URL for display
export const getImageUrl = (userId) => {
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/users/image/${userId}`;
};

// Legacy function names for backward compatibility
export const uploadProfileImage = uploadImage;
export const getProfileImageUrl = getImageUrl;
