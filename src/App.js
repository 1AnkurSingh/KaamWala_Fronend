// Main application component - Sets up routing and global configuration
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Navbar from './components/Navbar';
import { LanguageProvider } from './components/LanguageSwitcher';

// Import pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ContactPage,
  CategoriesPage,
  WorkersListingPage,
  AboutPage
} from './pages';

// Import services
import { initializeAuth } from './services';

// Import styles
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication on app start
  useEffect(() => {
    try {
      initializeAuth();
      setIsLoading(false);
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/:role" element={<RegisterPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/workers" element={<WorkersListingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          
          <ToastContainer position="top-right" />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
