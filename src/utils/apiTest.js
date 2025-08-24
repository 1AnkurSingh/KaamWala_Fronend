// API Test utility - Tests all backend endpoints to ensure they're working
import { 
  getAllActiveCategories,
  createUser,
  getUserById,
  uploadImage,
  loginUser
} from '../services';

export const testAllAPIs = async () => {
  const results = {
    categories: false,
    registration: false,
    login: false,
    imageUpload: false,
    userRetrieval: false
  };

  console.log('🧪 Starting comprehensive API tests...');

  // Test 1: Categories API
  try {
    console.log('📋 Testing Categories API...');
    const categoriesResponse = await getAllActiveCategories();
    if (categoriesResponse.success || categoriesResponse.data) {
      results.categories = true;
      console.log('✅ Categories API working - Found', categoriesResponse.data?.length || 'some', 'categories');
    } else {
      console.log('⚠️ Categories API returned unexpected format:', categoriesResponse);
    }
  } catch (error) {
    console.log('❌ Categories API failed:', error.message);
  }

  // Test 2: User Registration API
  try {
    console.log('👤 Testing User Registration API...');
    const testUser = {
      name: 'Test User API',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      gender: 'Male',
      about: 'Test user for API testing',
      phone: '+91 9876543210',
      role: 'customer',
      preferredLocation: 'Mumbai'
    };

    const registrationResponse = await createUser(testUser);
    if (registrationResponse.success) {
      results.registration = true;
      results.testUserId = registrationResponse.data.userId;
      console.log('✅ User Registration API working - Created user:', registrationResponse.data.userId);
    } else {
      console.log('⚠️ Registration API returned unexpected format:', registrationResponse);
    }
  } catch (error) {
    console.log('❌ User Registration API failed:', error.message);
  }

  // Test 3: User Retrieval API (if registration succeeded)
  if (results.testUserId) {
    try {
      console.log('🔍 Testing User Retrieval API...');
      const userResponse = await getUserById(results.testUserId);
      if (userResponse.success || userResponse.data) {
        results.userRetrieval = true;
        console.log('✅ User Retrieval API working - Retrieved user:', userResponse.data?.name);
      } else {
        console.log('⚠️ User Retrieval API returned unexpected format:', userResponse);
      }
    } catch (error) {
      console.log('❌ User Retrieval API failed:', error.message);
    }
  }

  // Test 4: Login API (using test user if created)
  if (results.registration) {
    try {
      console.log('🔐 Testing Login API...');
      const loginResponse = await loginUser('test@example.com', 'password123');
      if (loginResponse.success) {
        results.login = true;
        console.log('✅ Login API working - Token received');
      } else {
        console.log('⚠️ Login API returned unexpected format:', loginResponse);
      }
    } catch (error) {
      console.log('❌ Login API failed (expected for new user):', error.message);
    }
  }

  // Summary
  console.log('\n🎯 API Test Summary:');
  console.log('Categories API:', results.categories ? '✅ Working' : '❌ Failed');
  console.log('Registration API:', results.registration ? '✅ Working' : '❌ Failed');
  console.log('User Retrieval API:', results.userRetrieval ? '✅ Working' : '❌ Failed');
  console.log('Login API:', results.login ? '✅ Working' : '⚠️ Not tested/failed');

  const workingCount = Object.values(results).filter(Boolean).length - (results.testUserId ? 1 : 0);
  const totalTests = 4;
  
  console.log(`\n📊 Overall: ${workingCount}/${totalTests} APIs working (${Math.round(workingCount/totalTests*100)}%)`);

  return results;
};

// Quick backend connectivity test
export const testBackendConnectivity = async () => {
  try {
    console.log('🌐 Testing backend connectivity...');
    const response = await getAllActiveCategories();
    
    if (response) {
      console.log('✅ Backend is reachable');
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running (ECONNREFUSED)');
      console.log('💡 Make sure the Spring Boot backend is running on http://localhost:8080');
    } else {
      console.log('❌ Backend connectivity issue:', error.message);
    }
    return false;
  }
};

