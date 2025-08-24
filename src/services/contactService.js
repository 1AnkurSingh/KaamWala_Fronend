// Contact service - Handles contact form submissions and validation
import { apiClient } from "../utils/axiosConfig";

// Submit contact form message
export const submitContactForm = async (contactData) => {
  try {
    const response = await apiClient.post("/api/contact/submit", {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async () => {
  try {
    const response = await apiClient.get("/api/contact/messages");
    return response.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

// Validate contact form data
export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.subject || formData.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters long';
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Predefined contact form subjects
export const CONTACT_SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'worker-registration', label: 'Worker Registration Help' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'partnership', label: 'Partnership Opportunities' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
  { value: 'bug-report', label: 'Bug Report' },
  { value: 'feature-request', label: 'Feature Request' }
];
