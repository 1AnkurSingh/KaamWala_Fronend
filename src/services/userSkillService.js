// User skill service - Manages worker skills and proficiency levels
import { apiClient } from "../utils/axiosConfig";

// Create user skill for a worker
export const createUserSkill = async (userSkillData) => {
  try {
    const response = await apiClient.post("/api/user-skills/create", userSkillData);
    return response.data;
  } catch (error) {
    console.error('Error creating user skill:', error);
    throw error;
  }
};

// Get all skills for a specific user
export const getUserSkills = async (userId) => {
  try {
    const response = await apiClient.get(`/api/user-skills/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};

// Update existing user skill
export const updateUserSkill = async (userSkillId, userSkillData) => {
  try {
    const response = await apiClient.put(`/api/user-skills/${userSkillId}`, userSkillData);
    return response.data;
  } catch (error) {
    console.error('Error updating user skill:', error);
    throw error;
  }
};

// Delete user skill
export const deleteUserSkill = async (userSkillId) => {
  try {
    const response = await apiClient.delete(`/api/user-skills/${userSkillId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user skill:', error);
    throw error;
  }
};

// Create multiple skills for a user at once
export const createUserWithSkillsSeparately = async (userId, skills) => {
  try {
    const response = await apiClient.post(`/api/user-skills/bulk-create/${userId}`, skills);
    return response.data;
  } catch (error) {
    console.error('Error creating user skills:', error);
    throw error;
  }
};
