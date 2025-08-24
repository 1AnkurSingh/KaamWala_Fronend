// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllActiveCategories } from '../services/categoryService';
import { useLanguage } from '../components/LanguageSwitcher';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAllActiveCategories();
        if (response?.success && response?.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) navigate(`/workers?search=${encodeURIComponent(q)}`);
  };

  const getEmojiForCategory = (categoryName) => {
    const icons = {
      Plumbing: '🔧',
      Electrical: '⚡',
      Carpentry: '🔨',
      Painting: '🎨',
      Cleaning: '🧹',
      Gardening: '🌱',
      'Appliance Repair': '🔌',
      Masonry: '🧱',
      Welding: '🔥',
    };
    return icons[categoryName] || '🛠️';
  };

  if (loading) {
    return (
      <div className="homepage">
        <section className="hero-section">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-white mt-3">Loading KaamWala...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  {t('heroTitle')} <span className="text-warning">Near You</span>
                </h1>
                <p className="hero-subtitle">{t('heroSubtitle')}</p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="search-form mb-4" role="search" aria-label="Worker search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label={t('searchPlaceholder')}
                    />
                    <button className="btn btn-primary btn-lg" type="submit">
                      <i className="fas fa-search me-2" />
                      {t('findWorkers')}
                    </button>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="hero-buttons">
                  <Link to="/register/customer" className="btn btn-primary btn-lg me-3">
                    <i className="fas fa-user me-2" />
                    {t('hireWorkers')}
                  </Link>
                  <Link to="/register/worker" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-briefcase me-2" />
                    {t('startWorking')}
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="hero-illustration">
                  <i className="fas fa-users fa-8x text-white-50 mb-3" />
                  <h4 className="text-white-50">Workers connecting with customers</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{t('popularServices')}</h2>
            <p className="section-subtitle">{t('findSkilled')}</p>
          </div>

          <div className="row g-4">
            {categories.slice(0, 8).map((category) => (
              <div key={category.categoryId} className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  to={`/workers?categoryId=${category.categoryId}`}
                  className="text-decoration-none"
                  aria-label={`Open ${category.categoryName}`}
                >
                  <div className="category-card">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <div className="category-icon mb-3">
                          <span className="display-4">{getEmojiForCategory(category.categoryName)}</span>
                        </div>
                        <h5 className="card-title fw-bold text-primary mb-2">
                          {category.categoryName}
                        </h5>
                        {category.description && (
                          <p className="card-text text-muted small mb-3">{category.description}</p>
                        )}

                        {!!category.subCategories?.length && (
                          <div className="skills-preview">
                            {category.subCategories.slice(0, 3).map((subCat) => (
                              <span
                                key={subCat.subCategoryId}
                                className="badge bg-light text-dark me-1 mb-1"
                              >
                                {subCat.subCategoryName}
                              </span>
                            ))}
                            {category.subCategories.length > 3 && (
                              <span className="badge bg-primary">
                                +{category.subCategories.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/categories" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-th-large me-2" />
              {t('viewAllCategories')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{t('whyChoose')}</h2>
            <p className="section-subtitle">{t('whyChooseDesc')}</p>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-handshake fa-3x text-primary" />
                </div>
                <h5 className="feature-title">{t('directConnection')}</h5>
                <p className="feature-text">{t('directDesc')}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-star fa-3x text-warning" />
                </div>
                <h5 className="feature-title">{t('verifiedWorkers')}</h5>
                <p className="feature-text">{t('verifiedDesc')}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-rupee-sign fa-3x text-success" />
                </div>
                <h5 className="feature-title">{t('fairPricing')}</h5>
                <p className="feature-text">{t('fairPricingDesc')}</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon mb-3">
                  <i className="fas fa-shield-alt fa-3x text-info" />
                </div>
                <h5 className="feature-title">{t('qualityGuarantee')}</h5>
                <p className="feature-text">{t('qualityDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="stat-item">
                <h2 className="stat-number">1000+</h2>
                <p className="stat-label">Skilled Workers</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h2 className="stat-number">5000+</h2>
                <p className="stat-label">Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h2 className="stat-number">25+</h2>
                <p className="stat-label">Cities Covered</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h2 className="stat-number">4.8★</h2>
                <p className="stat-label">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-3">{t('ctaHeading')}</h2>
          <p className="mb-4 fs-5">{t('ctaSubheading')}</p>
          <div className="cta-buttons">
            <Link to="/register/worker" className="btn btn-light btn-lg me-3">
              <i className="fas fa-hard-hat me-2" />
              {t('ctaWorkerBtn')}
            </Link>
            <Link to="/register/customer" className="btn btn-outline-light btn-lg">
              <i className="fas fa-search me-2" />
              {t('ctaCustomerBtn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
