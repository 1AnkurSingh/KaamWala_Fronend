import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { loginUser } from '../services/authService';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const response = await loginUser(formData.email, formData.password);
      
      console.log('Login response:', response);
      console.log('Response structure:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        toast.success('Login successful! Welcome back.');
        
        // Get user data from response
        const userData = response.data.user || response.data;
        const userId = userData.userId || userData.id;
        
        console.log('Extracted userData:', userData);
        console.log('Extracted userId:', userId);
        
        if (userId) {
          console.log('Redirecting to profile page:', `/profile/${userId}`);
          // Redirect to user's profile page instead of homepage
          navigate(`/profile/${userId}`);
        } else {
          console.log('No userId found, redirecting to homepage');
          // Fallback to homepage if no user ID
          navigate('/');
        }
      } else {
        console.log('Login failed:', response.message);
        toast.error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid vh-100">
        <div className="row h-100">
          {/* Left Side - Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="login-form-container">
              <div className="login-header text-center mb-4">
                <Link to="/" className="brand-link">
                  <h2 className="brand-title">
                    <i className="fas fa-tools me-2 text-primary"></i>
                    KaamWala
                  </h2>
                </Link>
                <h3 className="login-title">Welcome Back</h3>
                <p className="login-subtitle text-muted">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="social-login mb-4">
                  <button type="button" className="btn btn-outline-dark w-100 mb-2">
                    <i className="fab fa-google me-2"></i>
                    Continue with Google
                  </button>
                  <button type="button" className="btn btn-outline-primary w-100">
                    <i className="fab fa-facebook-f me-2"></i>
                    Continue with Facebook
                  </button>
                </div>

                <div className="signup-link text-center">
                  <p className="mb-0">
                    Don't have an account? 
                    <Link to="/register/customer" className="ms-1 text-primary fw-bold">
                      Sign up as Customer
                    </Link>
                  </p>
                  <p className="mb-0 mt-1">
                    Want to work? 
                    <Link to="/register/worker" className="ms-1 text-success fw-bold">
                      Register as Worker
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Image/Info */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center login-image-section">
            <div className="login-image-content text-center text-white">
              <img 
                src="/api/placeholder/400/300" 
                alt="KaamWala Platform" 
                className="img-fluid mb-4 rounded-3 shadow-lg"
              />
              <h3 className="mb-3">Connect with Skilled Workers</h3>
              <p className="lead mb-4">
                Find trusted professionals in your area for all your service needs
              </p>
              <div className="features-list text-start d-inline-block">
                <div className="feature-item mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Verified professionals
                </div>
                <div className="feature-item mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Transparent pricing
                </div>
                <div className="feature-item mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Quality guaranteed
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />

      <style jsx>{`
        .login-page {
          background: #f8f9fa;
        }
        
        .login-form-container {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
        }
        
        .brand-link {
          text-decoration: none;
          color: inherit;
        }
        
        .brand-title {
          color: #2c3e50;
          font-weight: 800;
          margin-bottom: 0;
        }
        
        .login-title {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .login-subtitle {
          font-size: 1.1rem;
        }
        
        .login-form .form-control {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .login-form .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .input-group-text {
          border-radius: 10px 0 0 10px;
          border: 2px solid #e9ecef;
          border-right: none;
          background: #f8f9fa;
        }
        
        .input-group .form-control {
          border-radius: 0 10px 10px 0;
          border-left: none;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .forgot-password-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        
        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }
        
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e9ecef;
        }
        
        .divider span {
          background: #f8f9fa;
          padding: 0 1rem;
          color: #6c757d;
        }
        
        .social-login .btn {
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-weight: 500;
        }
        
        .login-image-section {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%),
                      url('/api/placeholder/800/600') center/cover;
        }
        
        .feature-item {
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .login-form-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

