import { Link, NavLink } from "react-router-dom";
// import LanguageSwitcher from '../components/LanguageSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from "react";
import { isAuthenticated, getStoredUser, logoutUser } from "../services/authService";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const userData = getStoredUser();
      setUser(userData);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);
      // Redirect to homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top">
      <div className="container">
        <div className="d-flex align-items-center me-3">
          <LanguageSwitcher />
        </div>
        
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <i className="fas fa-tools me-2"></i>
          KaamWala
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleNavbar}
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories">
                <i className="fas fa-th-grid me-1"></i>Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/workers">
                <i className="fas fa-users me-1"></i>Find Workers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                <i className="fas fa-info-circle me-1"></i>About
              </NavLink>
            </li>
          <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                <i className="fas fa-envelope me-1"></i>Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Side Navigation */}
          <ul className="navbar-nav">
            {isLoggedIn ? (
              // User is logged in - show profile and logout
              <>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle me-1"></i>
                    {user?.name || 'Profile'}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user me-2 text-primary"></i>My Profile
                      </Link>
                    </li>
                    {user?.role === 'worker' && (
                      <li>
                        <Link className="dropdown-item" to="/dashboard">
                          <i className="fas fa-tachometer-alt me-2 text-success"></i>Dashboard
                        </Link>
                      </li>
                    )}
                    {user?.role === 'customer' && (
                      <li>
                        <Link className="dropdown-item" to="/bookings">
                          <i className="fas fa-calendar-check me-2 text-info"></i>My Bookings
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // User is not logged in - show join us and login
              <>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user-plus me-1"></i>Join Us
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/register/worker">
                        <i className="fas fa-hard-hat me-2 text-success"></i>Register as Worker
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register/customer">
                        <i className="fas fa-user me-2 text-info"></i>Register as Customer
                      </Link>
          </li>
        </ul>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </NavLink>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-light btn-sm" to="/register/worker">
                    <i className="fas fa-briefcase me-1"></i>Start Working
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
