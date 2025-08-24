// ID generator utilities - Creates unique identifiers for entities
let userSkillCounter = 1;

// Generate sequential user skill ID
export const generateSequentialUserSkillId = (userId, index = 0) => {
  const timestamp = Date.now();
  const counter = userSkillCounter++;
  return `USK_${userId}_${timestamp}_${counter}`;
};

// Generate unique user ID
export const generateUserId = (role, timestamp = Date.now()) => {
  const random = Math.random().toString(36).substr(2, 9);
  return `${role.toUpperCase()}_${timestamp}_${random}`;
};

// Generate category ID
export const generateCategoryId = (categoryName, timestamp = Date.now()) => {
  const cleanName = categoryName.replace(/\s+/g, '_').toUpperCase();
  return `${cleanName}_CAT_${timestamp}`;
};

// Generate subcategory ID
export const generateSubCategoryId = (categoryId, subCategoryName, timestamp = Date.now()) => {
  const cleanName = subCategoryName.replace(/\s+/g, '_').toUpperCase();
  const categoryPrefix = categoryId.split('_')[0];
  return `${categoryPrefix}_SUB_${timestamp}`;
};

