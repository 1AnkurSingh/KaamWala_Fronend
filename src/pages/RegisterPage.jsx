// Registration page - Allows users to register as workers or customers
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser } from '../services/userService';
import { uploadImage } from '../services/imageService';
import { testBackendConnection, diagnoseCORSIssue } from '../utils/corsConfig';
import './RegisterPage.css';

const RegisterPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);


  // Title & badge based on role
  const meta = {
    title: role === "worker" ? "Register as Worker" : "Register as Customer",
    badgeClass: role === "worker" ? "bg-success" : "bg-info",
    emoji: role === "worker" ? "👷" : "🧑‍💼",
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('profileImage');
    if (fileInput) fileInput.value = '';
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submitted! Starting registration process...');
    setLoading(true);

    try {
      // Skip connectivity test for now and proceed directly with registration
      console.log('🔄 Proceeding with registration...');
      const formData = new FormData(e.target);
      const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        gender: formData.get('gender'),
        about: formData.get('about'),
        phone: formData.get('phone'),
        role: role,
      };

      // Add role-specific fields
      if (role === 'worker') {
        userData.experience = parseInt(formData.get('experience')) || 0;
        userData.hourlyRate = parseFloat(formData.get('hourlyRate')) || 0;
        userData.serviceAreas = formData.get('serviceAreas');
        userData.preferredLocation = formData.get('preferredLocation'); // Primary location for workers
        // Note: Skills will be added later from profile page to avoid ModelMapper issues
        userData.userSkills = [];
      } else {
        userData.preferredLocation = formData.get('preferredLocation');
      }

      console.log('Submitting user data:', userData);

      // Create user
      const response = await createUser(userData);
      
      if (response.success) {
        const userId = response.data.userId;
        toast.success('Registration successful! Welcome to KaamWala!');

        // Upload profile image if selected
        if (selectedImage) {
          try {
            const imageResponse = await uploadImage(`/users/uploadImage/${userId}`, selectedImage);
            if (imageResponse.success) {
              toast.success('Profile picture uploaded successfully!');
            }
          } catch (error) {
            console.error('Image upload error:', error);
            toast.warning('Profile created but image upload failed. You can upload it later.');
          }
        }

        // Store user data for profile page
        localStorage.setItem('newlyCreatedUser', JSON.stringify(response.data));
        
        // Redirect to profile page
        navigate(`/profile/${userId}`);
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Fixed Header Section */}
      <div className="register-header-fixed">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-md-4">
              <Link to="/" className="btn btn-outline-light">
                <i className="fas fa-arrow-left me-2"></i>Back to Home
              </Link>
            </div>
            <div className="col-md-4 text-center">
              <div className="header-content">
                <span className="role-emoji display-4 mb-2">{meta.emoji}</span>
                <h1 className="register-title text-white mb-1">{meta.title}</h1>
                <span className={`badge ${meta.badgeClass} fs-6`}>{role}</span>
              </div>
            </div>
            <div className="col-md-4">
              {/* Spacer for alignment */}
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            
            {/* Registration Form */}
            <div className="register-form-container">
              <div className="card shadow-lg border-0">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit} className="register-form">
                    
                    {/* Profile Picture Section */}
                    <div className="profile-picture-section text-center mb-5">
                      <h4 className="section-title mb-4">
                        <i className="fas fa-camera me-2 text-primary"></i>
                        Profile Picture
                      </h4>
                      
                      <div className="profile-picture-container mb-4">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="profile-preview shadow"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            <i className="fas fa-user fa-4x text-muted mb-3"></i>
                            <div className="text-muted">No Image Selected</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="profile-buttons">
                        <label htmlFor="profileImage" className="btn btn-primary me-2">
                          <i className="fas fa-upload me-2"></i>Choose Photo
                        </label>
                        {selectedImage && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={removeImage}
                          >
                            <i className="fas fa-trash me-2"></i>Remove
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                      
                      <small className="text-muted d-block mt-2">
                        Supported formats: JPG, PNG, GIF • Max size: 5MB
                      </small>
                    </div>

                    {/* Personal Information Section */}
                    <div className="form-section mb-5">
                      <h4 className="section-title mb-4">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Personal Information
                      </h4>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label htmlFor="name" className="form-label fw-semibold">Full Name *</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="name"
                            name="name"
                            placeholder="e.g., Manoj Thakur"
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-4">
                          <label htmlFor="email" className="form-label fw-semibold">Email Address *</label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            id="email"
                            name="email"
                            placeholder="e.g., manoj.painter@gmail.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label htmlFor="password" className="form-label fw-semibold">Password *</label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            id="password"
                            name="password"
                            placeholder="Minimum 6 characters"
                            minLength="6"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6 mb-4">
                          <label htmlFor="gender" className="form-label fw-semibold">Gender *</label>
                          <select className="form-select form-select-lg" id="gender" name="gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label htmlFor="phone" className="form-label fw-semibold">Contact Number *</label>
                          <input
                            type="tel"
                            className="form-control form-control-lg"
                            id="phone"
                            name="phone"
                            placeholder="e.g., +91 98765 43210"
                            pattern="^(\+91\s?)?[789]\d{9}$"
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-4">
                          <label htmlFor="preferredLocation" className="form-label fw-semibold">
                            {role === 'worker' ? 'Primary Location *' : 'Preferred Location *'}
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="preferredLocation"
                            name="preferredLocation"
                            placeholder="e.g., Mumbai, Andheri"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Worker-specific fields */}
                    {role === "worker" && (
                      <div className="form-section mb-5">
                        <h4 className="section-title mb-4">
                          <i className="fas fa-briefcase me-2 text-primary"></i>
                          Professional Information
                        </h4>
                        
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <label htmlFor="experience" className="form-label fw-semibold">Years of Experience</label>
                            <input
                              type="number"
                              className="form-control form-control-lg"
                              id="experience"
                              name="experience"
                              placeholder="e.g., 5"
                              min="0"
                              max="50"
                            />
                          </div>
                          
                          <div className="col-md-6 mb-4">
                            <label htmlFor="hourlyRate" className="form-label fw-semibold">Base Hourly Rate (₹)</label>
                            <input
                              type="number"
                              className="form-control form-control-lg"
                              id="hourlyRate"
                              name="hourlyRate"
                              placeholder="e.g., 500"
                              min="0"
                              step="50"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="serviceAreas" className="form-label fw-semibold">Service Areas (Cities/Localities) *</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="serviceAreas"
                            name="serviceAreas"
                            placeholder="e.g., Mumbai, Andheri, Bandra"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Skills & Specializations</label>
                          <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            Skills can be added after registration from your profile page.
                          </div>
                          <textarea
                            className="form-control form-control-lg"
                            name="skillsDescription"
                            rows="3"
                            placeholder="Briefly describe your main skills (e.g., House Painting, Wall Repair, Interior Design)"
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {/* About Section */}
                    <div className="form-section mb-5">
                      <h4 className="section-title mb-4">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Additional Information
                      </h4>
                      
                      <div className="mb-4">
                        <label htmlFor="about" className="form-label fw-semibold">About Yourself</label>
                        <textarea
                          className="form-control form-control-lg"
                          id="about"
                          name="about"
                          rows="4"
                          placeholder={
                            role === "worker"
                              ? "Tell customers about your experience, specializations, and what makes you unique..."
                              : "Tell us about your service needs, preferences, and any specific requirements..."
                          }
                        ></textarea>
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="form-section text-center">
                      <div className="d-grid gap-3">
                        <button 
                          className="btn btn-primary btn-lg py-3" 
                          type="submit" 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Creating Your Account...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-plus me-2"></i>
                              Create My {role === 'worker' ? 'Worker' : 'Customer'} Account
                            </>
                          )}
                        </button>
                        
                        <div className="row g-2">
                          <div className="col-md-6">
                            <button
                              type="button"
                              className="btn btn-outline-info w-100"
                              onClick={async () => {
                                console.log('🔄 Testing backend connection...');
                                const test = await testBackendConnection();
                                if (test.success) {
                                  toast.success('✅ Backend connection successful!');
                                } else {
                                  toast.error(`❌ ${test.message}`);
                                  diagnoseCORSIssue();
                                }
                              }}
                              disabled={loading}
                            >
                              <i className="fas fa-wifi me-2"></i>Test Backend
                            </button>
                          </div>
                          <div className="col-md-6">
                            <button
                              type="button"
                              className="btn btn-outline-secondary w-100"
                              onClick={() => window.location.reload()}
                              disabled={loading}
                            >
                              <i className="fas fa-redo me-2"></i>Reset Form
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account? 
                  <Link to="/login" className="text-primary ms-1">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
