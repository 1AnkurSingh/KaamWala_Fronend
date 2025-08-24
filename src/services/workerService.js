// Worker search service - Handles worker discovery and search functionality
import { apiClient } from "../utils/axiosConfig";

// Get all workers with pagination
export const getAllWorkers = async (page = 1, size = 20, sortBy = "name") => {
  try {
    const response = await apiClient.get(`/api/workers/all?page=${page - 1}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all workers:', error);
    throw error;
  }
};

// Advanced worker search with multiple filters
export const searchWorkers = async (filters = {}, pageNumber = 1, pageSize = 10, sortBy = "rating", sortDir = "desc") => {
  try {
    const queryParams = new URLSearchParams({
      keyword: filters.keyword || '',
      location: filters.location || '',
      categoryId: filters.categoryId || '',
      subCategory: filters.subCategory || '',
      minPrice: filters.minPrice || '',
      maxPrice: filters.maxPrice || '',
      experienceYears: filters.experienceYears || '',
      pageNumber: pageNumber - 1,  // Convert to 0-based for backend
      pageSize: pageSize,
      sortBy: sortBy,
      sortDir: sortDir
    });

    const response = await apiClient.get(`/api/search/workers/advanced?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error in advanced worker search:', error);
    throw error;
  }
};

// Search workers by category
export const getWorkersByCategory = async (categoryId, page = 1, size = 20) => {
  try {
    const response = await apiClient.get(`/api/workers/search/category/${categoryId}?page=${page - 1}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workers by category:', error);
    throw error;
  }
};

// Search workers by specific skill
export const getWorkersBySkill = async (skillId, page = 1, size = 20) => {
  try {
    const response = await apiClient.get(`/api/workers/search/skill/${skillId}?page=${page - 1}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workers by skill:', error);
    throw error;
  }
};

// Search workers by location
export const getWorkersByLocation = async (location, page = 1, size = 20) => {
  try {
    const response = await apiClient.get(`/api/workers/search/location/${encodeURIComponent(location)}?page=${page - 1}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workers by location:', error);
    throw error;
  }
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (query) => {
  try {
    const response = await apiClient.get(`/api/search/suggestions?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    throw error;
  }
};

// Build search URL for navigation
export const buildWorkerSearchUrl = (filters) => {
  const params = new URLSearchParams();
  
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.location) params.append('location', filters.location);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.subCategory) params.append('subCategory', filters.subCategory);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.experienceYears) params.append('experienceYears', filters.experienceYears);
  
  return `/workers/search?${params.toString()}`;
};

// Format worker data for consistent display
export const formatWorkerForDisplay = (worker) => {
  return {
    id: worker.userId,
    name: worker.name,
    experience: worker.experienceYears || 0,
    hourlyRate: worker.hourlyRate || 0,
    serviceAreas: worker.serviceArea || '',
    phone: worker.phoneNumber || '',
    imageUrl: worker.imageName ? `/users/image/${worker.userId}` : '/default-avatar.png',
    skills: worker.userSkills ? worker.userSkills.map(skill => skill.subCategoryName) : [],
    rating: worker.rating || 4.5,
    totalJobs: worker.totalJobs || 25,
    responseTime: '2 hours',
    availability: 'Available'
  };
};
