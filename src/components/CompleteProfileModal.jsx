// src/components/CompleteProfileModal.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createUser } from "../services/userService";
import SkillsSelector from "./SkillsSelector";
import { generateSequentialUserSkillId } from "../utils/idGenerator";
import "./CompleteProfileModal.css";

export default function CompleteProfileModal({ user, onClose, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      experience: user.experience || '',
      hourlyRate: user.hourlyRate || '',
      serviceAreas: user.serviceAreas || '',
      skills: user.skills || [],
      phone: user.phone || '',
      preferredLocation: user.preferredLocation || ''
    }
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      
      // ✅ Prepare comprehensive user data for all users
      const updatedUserData = {
        ...user, // Keep existing data
        phone: values.phone,
        experience: parseInt(values.experience) || 0,
        hourlyRate: parseFloat(values.hourlyRate) || 0,
        // Convert subcategory IDs to skill names for backend compatibility
        // Note: In future, you can create a separate UserSkill management API
        userSkills: values.skills ? values.skills.map((skillId, index) => ({
          userSkillId: generateSequentialUserSkillId(user.userId || 'edit_user', index),
          subCategoryId: skillId,
          proficiencyLevel: 'INTERMEDIATE', // Default value
          experienceYears: parseInt(values.experience) || 0,
          skillHourlyRate: parseFloat(values.hourlyRate) || 0,
          isPrimarySkill: index === 0 // First skill as primary
        })) : []
      };
      
      // Set location fields based on user role
      if (user.role === 'customer') {
        updatedUserData.preferredLocation = values.preferredLocation;
        updatedUserData.serviceAreas = values.serviceAreas || values.preferredLocation;
      } else {
        updatedUserData.serviceAreas = values.serviceAreas;
        updatedUserData.preferredLocation = values.preferredLocation || values.serviceAreas;
      }
      
      console.log('Updating profile with comprehensive data:', updatedUserData);
      
      // Call the same API endpoint
      const response = await createUser(updatedUserData);
      
      if (response.data) {
        // ✅ Success: Update profile data with all fields
        const completedData = {
          phone: values.phone,
          experience: parseInt(values.experience) || 0,
          hourlyRate: parseFloat(values.hourlyRate) || 0,
          skills: values.skills || [],
          userSkills: updatedUserData.userSkills,
          preferredLocation: user.role === 'customer' ? values.preferredLocation : (values.preferredLocation || values.serviceAreas),
          serviceAreas: user.role === 'worker' ? values.serviceAreas : (values.serviceAreas || values.preferredLocation)
        };
        
        onComplete(completedData);
        toast.success('Profile updated successfully! 🎉');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">
            {/* Dynamic title based on whether profile has data */}
            {user.phone || user.preferredLocation || user.experience ? 
              '✏️ Edit Your Profile' : 
              '🚀 Complete Your Profile'
            }
          </h5>
          <button type="button" className="btn-close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 📱 Contact Information Section */}
            <div className="form-section mb-4">
              <h6 className="section-title">📱 Contact Information</h6>
              <div className="mb-3">
                <label className="form-label fw-bold">Phone Number *</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: { 
                      value: /^(\+91\s?)?[789]\d{9}$/, 
                      message: 'Please provide a valid Indian phone number' 
                    }
                  })}
                  placeholder="e.g., +91 98765 43210"
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone.message}</div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">
                  {user.role === 'customer' ? 'Preferred Location *' : 'Service Areas *'}
                </label>
                <input
                  type="text"
                  className={`form-control ${user.role === 'customer' ? (errors.preferredLocation ? 'is-invalid' : '') : (errors.serviceAreas ? 'is-invalid' : '')}`}
                  {...register(user.role === 'customer' ? 'preferredLocation' : 'serviceAreas', { 
                    required: user.role === 'customer' ? 'Preferred location is required' : 'Service areas are required',
                    maxLength: { value: 500, message: 'Cannot exceed 500 characters' }
                  })}
                  placeholder={user.role === 'customer' ? 'e.g., Mumbai, Andheri' : 'e.g., Mumbai, Andheri, Bandra, Pune'}
                />
                {user.role === 'customer' ? (
                  errors.preferredLocation && (
                    <div className="invalid-feedback">{errors.preferredLocation.message}</div>
                  )
                ) : (
                  errors.serviceAreas && (
                    <div className="invalid-feedback">{errors.serviceAreas.message}</div>
                  )
                )}
                <small className="text-muted">
                  {user.role === 'customer' 
                    ? 'Enter your preferred service location' 
                    : 'Enter cities or localities where you provide services'
                  }
                </small>
              </div>
            </div>

            {/* 💼 Professional Information Section */}
            <div className="form-section mb-4">
              <h6 className="section-title">💼 Professional Information</h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Years of Experience *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                      {...register('experience', { 
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience cannot be negative' },
                        max: { value: 50, message: 'Experience cannot exceed 50 years' }
                      })}
                      min="0"
                      max="50"
                      placeholder="e.g., 5"
                    />
                    {errors.experience && (
                      <div className="invalid-feedback">{errors.experience.message}</div>
                    )}
                    <small className="text-muted">
                      {user.role === 'customer' ? 'Years of experience in hiring services' : 'Years of professional experience'}
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      {user.role === 'worker' ? 'Hourly Rate (₹) *' : 'Budget Range (₹/hour) *'}
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
                      {...register('hourlyRate', { 
                        required: user.role === 'worker' ? 'Hourly rate is required' : 'Budget range is required',
                        min: { value: 50, message: 'Rate should be at least ₹50' },
                        max: { value: 5000, message: 'Rate cannot exceed ₹5000' }
                      })}
                      min="50"
                      max="5000"
                      placeholder="e.g., 200"
                    />
                    {errors.hourlyRate && (
                      <div className="invalid-feedback">{errors.hourlyRate.message}</div>
                    )}
                    <small className="text-muted">
                      {user.role === 'worker' ? 'Your hourly service rate' : 'Your preferred budget range'}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* 🛠️ Skills & Specializations Section */}
            <div className="form-section">
              <h6 className="section-title">🛠️ Skills & Specializations</h6>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  {user.role === 'worker' ? 'Your Skills & Specializations *' : 'Required Skills & Services *'}
                </label>
                <SkillsSelector
                  selectedSkills={watch('skills') || []}
                  onChange={(skills) => setValue('skills', skills)}
                  error={errors.skills}
                />
                {errors.skills && (
                  <div className="text-danger small mt-1">{errors.skills.message}</div>
                )}
                <small className="text-muted">
                  {user.role === 'worker' 
                    ? 'Select your professional skills and specializations'
                    : 'Select the types of services you typically need'
                  }
                </small>
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : (
              user.phone || user.preferredLocation || user.experience ? 
                'Update Profile' : 
                'Complete Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
