// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfilePage.css";
import CompleteProfileModal from "../components/CompleteProfileModal";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // First check for newly created user data
        const newUserData = localStorage.getItem('newlyCreatedUser');
        if (newUserData) {
          const parsedUser = JSON.parse(newUserData);
          console.log('🔍 Loaded new user data:', parsedUser);
          console.log('🖼️ Image info:', {
            imageName: parsedUser.imageName,
            profileImage: parsedUser.profileImage,
            userId: parsedUser.userId
          });
          setUser(parsedUser);
          setLoading(false);
          // Clear from localStorage after displaying
          localStorage.removeItem('newlyCreatedUser');
          return;
        }

        // If no new user data, try to fetch from backend
        if (userId) {
          try {
            const { getUserById } = await import('../services/userService');
            const response = await getUserById(userId);
            if (response.success) {
              setUser(response.data);
            } else {
              toast.error('User not found');
              navigate('/');
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user profile');
            navigate('/');
          }
        } else {
          toast.info('No user ID provided');
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, navigate]);

  // Check if profile is complete based on role
  const isProfileComplete = user && user.name && user.email && user.phone && user.gender &&
    ((user.role === 'worker' && user.serviceAreas && user.preferredLocation) || 
     (user.role === 'customer' && user.preferredLocation));

  // Check if any profile is incomplete
  const isProfileIncomplete = user && !isProfileComplete;



  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <h4>Profile Not Found</h4>
          <p>Unable to load your profile information.</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="mb-2">
            🎉 Welcome to KaamWala!
          </h1>
          <p className="text-muted mb-0">
            Your account has been created successfully
          </p>
        </div>
        <div className="text-end">
          <Link to="/" className="btn btn-outline-primary me-2">
            ← Back to Home
          </Link>
          <Link to="/users" className="btn btn-primary">
            View All Users
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 profile-card">
            <div className="card-header profile-header text-center py-4">
              <div className="mb-3">
                <div className="profile-avatar">
                  {user.imageName ? (
                    <img 
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/users/image/${user.userId || userId}`}
                      alt={`${user.name}'s Profile`}
                      className="rounded-circle"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        console.log('Profile image failed to load, showing emoji fallback');
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                      onLoad={(e) => {
                        // Hide emoji when image loads successfully
                        console.log('Profile image loaded successfully');
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span 
                    className="fs-1 text-primary"
                    style={{ display: user.imageName ? 'none' : 'block' }}
                  >
                    {user.gender === 'Male' ? '👨' : user.gender === 'Female' ? '👩' : '👤'}
                  </span>
                </div>
              </div>
              <h3 className="mb-1 text-white">{user.name}</h3>
              <p className="mb-0 text-white-50">
                {user.role === 'worker' ? '👷 Professional Worker' : '🧑‍💼 Valued Customer'}
              </p>
            </div>

            <div className="card-body p-4">
              {/* ✅ NEW: Profile Action Banner */}
              <div className={`alert ${isProfileIncomplete ? 'alert-info' : 'alert-success'} mb-4`}>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {isProfileIncomplete ? '📝 Profile Completion' : '✅ Profile Complete'}
                    </h6>
                      <p className="mb-2">
                      {isProfileIncomplete 
                        ? (user.role === 'worker' 
                          ? 'Complete your professional profile to get more job opportunities!' 
                          : 'Complete your customer profile to get better service recommendations!')
                        : 'Your profile is complete! You can update it anytime.'
                        }
                      </p>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowCompleteProfile(true)}
                    >
                    {isProfileIncomplete ? '🚀 Complete Profile' : '✏️ Edit Profile'}
                    </button>
                  </div>
                </div>

              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-primary mb-3">📋 Personal Information</h5>
                  <div className="profile-section">
                    <label className="profile-label">Full Name</label>
                    <p className="profile-value">{user.name}</p>
                  </div>
                  <div className="profile-section">
                    <label className="profile-label">Email Address</label>
                    <p className="profile-value">{user.email}</p>
                  </div>
                  <div className="profile-section">
                    <label className="profile-label">Gender</label>
                    <p className="profile-value">
                      {user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other'}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="text-primary mb-3">🎯 Account Details</h5>
                  <div className="profile-section">
                    <label className="profile-label">User ID</label>
                    <p className="profile-value">
                      {user.userId || userId || 'Generated after backend sync'}
                    </p>
                  </div>
                  <div className="profile-section">
                    <label className="profile-label">Account Type</label>
                    <div className="mt-2 account-type-badge">
                      <span className={`badge fs-6 badge-custom ${
                        user.role === 'worker' ? 'bg-success' : 'bg-info'
                      }`}>
                        {user.role === 'worker' ? 'Worker' : 'Customer'}
                      </span>
                    </div>
                  </div>
                  <div className="profile-section">
                    <label className="profile-label">Registration Date</label>
                    <p className="profile-value">
                      {new Date().toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {user.about && (
                <div className="mt-4">
                  <h5 className="text-primary mb-3">💬 About</h5>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0">{user.about}</p>
                  </div>
                </div>
              )}

              {/* Professional Information - for all users */}
                <div className="mt-4">
                <h5 className="text-primary mb-3">💼 Professional Information</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="profile-section">
                          <label className="profile-label">Years of Experience</label>
                          <p className="profile-value">
                            {user.experience || 0} {user.experience === 1 ? 'year' : 'years'}
                          </p>
                        </div>
                        <div className="profile-section">
                      <label className="profile-label">
                        {user.role === 'worker' ? 'Hourly Rate' : 'Budget Range'}
                      </label>
                          <p className="profile-value">
                            ₹{user.hourlyRate || 0}/hour
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-section">
                      <label className="profile-label">
                        {user.role === 'worker' ? 'Service Areas' : 'Preferred Location'}
                      </label>
                          <p className="profile-value">
                        {user.role === 'worker' 
                          ? (user.serviceAreas || 'Not specified')
                          : (user.preferredLocation || 'Not specified')
                        }
                          </p>
                        </div>
                        <div className="profile-section">
                      <label className="profile-label">
                        {user.role === 'worker' ? 'Skills & Specializations' : 'Required Services'}
                      </label>
                          <div className="d-flex flex-wrap gap-1">
                            {user.skills && Array.isArray(user.skills) ? (
                              user.skills.map((skill, index) => (
                                <span key={index} className="badge bg-primary me-1">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">No skills specified</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

              {/* Contact Information */}
              <div className="mt-4">
                <h5 className="text-primary mb-3">📞 Contact Information</h5>
                <div className="profile-section">
                  <label className="profile-label">Phone Number</label>
                  <p className="profile-value">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Next Steps Section */}
              <div className="mt-5 next-steps-section p-4">
                <h5 className="mb-3">🚀 What's Next?</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>For Workers:</h6>
                    <ul className="list-unstyled">
                      <li>✅ Complete your profile</li>
                      <li>✅ Add your skills & experience</li>
                      <li>✅ Set your service areas</li>
                      <li>✅ Start receiving job requests</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>For Customers:</h6>
                    <ul className="list-unstyled">
                      <li>✅ Browse available workers</li>
                      <li>✅ Post job requirements</li>
                      <li>✅ Get quotes & hire</li>
                      <li>✅ Rate & review services</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex action-buttons mt-4 justify-content-center">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => navigate('/users')}
                >
                  👥 Explore Community
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => navigate('/')}
                >
                  🏠 Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Complete Profile Modal */}
      {showCompleteProfile && (
        <CompleteProfileModal 
          user={user}
          onClose={() => setShowCompleteProfile(false)}
          onComplete={(updatedData) => {
            // Update local state with new data
            const updatedProfile = { ...user, ...updatedData };
            setUser(updatedProfile);
            setShowCompleteProfile(false);
            toast.success('Profile completed successfully! 🎉');
          }}
        />
      )}

      <ToastContainer position="top-right" newestOnTop />
    </div>
  );
}
