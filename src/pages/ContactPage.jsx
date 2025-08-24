import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { submitContactForm, validateContactForm, CONTACT_SUBJECTS } from '../services/contactService';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="contact-form-card">
                <h2 className="mb-4">Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <select
                        className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose a subject</option>
                        {CONTACT_SUBJECTS.map(subject => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        required
                      ></textarea>
                      {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="contact-info">
                <h3 className="mb-4">Get in Touch</h3>
                
                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <h5>Address</h5>
                    <p className="text-muted">
                      Kaamwala HQ<br />
                      123 Innovation Street<br />
                      Tech City, India 110001
                    </p>
                  </div>
                </div>
                
                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-phone text-primary"></i>
                  </div>
                  <div>
                    <h5>Phone</h5>
                    <p className="text-muted">
                      +91 9876543210<br />
                      Mon-Sat, 9AM-6PM IST
                    </p>
                  </div>
                </div>
                
                <div className="contact-item mb-4">
                  <div className="contact-icon">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p className="text-muted">
                      support@kaamwala.com<br />
                      hello@kaamwala.com
                    </p>
                  </div>
                </div>
                
                <div className="social-links mt-4">
                  <h5 className="mb-3">Follow Us</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="social-link facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to common questions</p>
          </div>
          
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I register as a worker?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Click on "Register as Worker" and fill out your profile with your skills, experience, and service areas. Our team will verify your details within 24-48 hours.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      How do I find workers in my area?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Use our search function on the homepage or browse categories. You can filter by location, ratings, and price range to find the perfect worker for your needs.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      What are the charges for using KaamWala?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      KaamWala charges minimal service fees compared to traditional platforms. Workers keep 95% of their earnings, and customers enjoy transparent pricing with no hidden charges.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      How do you ensure worker quality?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      All workers go through our verification process including ID verification, skill assessment, and background checks. Customer reviews and ratings help maintain quality standards.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" />
      
      <style jsx>{`
        .contact-form-card {
          background: white;
          padding: 3rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .contact-info {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          height: fit-content;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
        }
        
        .contact-icon {
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .contact-icon i {
          font-size: 1.2rem;
        }
        
        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-link.facebook { background: #3b5998; }
        .social-link.twitter { background: #1da1f2; }
        .social-link.instagram { background: #e4405f; }
        .social-link.linkedin { background: #0077b5; }
        
        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          color: white;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .section-subtitle {
          font-size: 1.2rem;
          color: #6c757d;
          margin-bottom: 3rem;
        }
      `}</style>
    </div>
  );
}
