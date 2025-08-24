// Category service - Manages service categories and subcategories
import { apiClient } from "../utils/axiosConfig";

// Get all active categories with subcategories
export const getAllActiveCategories = async () => {
  try {
    const response = await apiClient.get("/api/categories/active");
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback data for development
    return {
      success: true,
      data: [
        {
          categoryId: "PLUMBING_CAT_001",
          categoryName: "Plumbing",
          description: "Water systems, pipes, fixtures installation and repair",
          iconName: "🔧",
          isActive: true,
          subCategories: [
            { subCategoryId: "PLUMB_SUB_001", subCategoryName: "Pipe Installation" },
            { subCategoryId: "PLUMB_SUB_002", subCategoryName: "Leak Repair" },
            { subCategoryId: "PLUMB_SUB_003", subCategoryName: "Fixture Installation" },
            { subCategoryId: "PLUMB_SUB_004", subCategoryName: "Drain Cleaning" }
          ]
        },
        {
          categoryId: "ELECTRICAL_CAT_001",
          categoryName: "Electrical",
          description: "Electrical wiring, installations, and repairs",
          iconName: "⚡",
          isActive: true,
          subCategories: [
            { subCategoryId: "ELEC_SUB_001", subCategoryName: "Wiring Installation" },
            { subCategoryId: "ELEC_SUB_002", subCategoryName: "Switch & Socket" },
            { subCategoryId: "ELEC_SUB_003", subCategoryName: "Fan Installation" },
            { subCategoryId: "ELEC_SUB_004", subCategoryName: "Electrical Repair" }
          ]
        }
      ]
    };
  }
};

// Get all active subcategories
export const getAllActiveSubCategories = async () => {
  try {
    const response = await apiClient.get("/api/categories/subcategories/active");
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return { success: false, data: [] };
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`/api/categories/getById/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Get subcategory by ID
export const getSubCategoryById = async (subCategoryId) => {
  try {
    const response = await apiClient.get(`/api/categories/subcategories/getById/${subCategoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    throw error;
  }
};
