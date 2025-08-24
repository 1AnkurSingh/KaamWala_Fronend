// Categories page - Displays all available service categories and subcategories
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllActiveCategories } from '../services/categoryService';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAllActiveCategories();
        if (response.success && response.data) {
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.categoryId === category.categoryId ? null : category);
  };

  const getEmojiForCategory = (categoryName) => {
    const icons = {
      'Plumbing': '🔧',
      'Electrical': '⚡',
      'Carpentry': '🔨',
      'Painting': '🎨',
      'Cleaning': '🧹',
      'Gardening': '🌱',
      'Appliance Repair': '🔌',
      'Masonry': '🧱',
      'Welding': '🔥'
    };
    return icons[categoryName] || "🛠️";
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            <i className="fas fa-tools me-3"></i>
            Service Categories
          </h1>
          <p className="lead text-muted">
            Explore our comprehensive range of professional services
          </p>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.categoryId} className="col-lg-6 col-xl-4">
              <div className="category-card h-100">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <div className="category-icon mb-3">
                        <span className="display-4">{getEmojiForCategory(category.categoryName)}</span>
                      </div>
                      <h4 className="card-title fw-bold text-primary mb-2">
                        {category.categoryName}
                      </h4>
                      <p className="card-text text-muted mb-3">
                        {category.description}
                      </p>
                    </div>

                    <div className="skills-list mb-3">
                      <h6 className="fw-bold mb-2">Available Skills:</h6>
                      <div className="row g-2">
                        {category.subCategories.map((subCategory) => (
                          <div key={subCategory.subCategoryId} className="col-6">
                            <span className="badge bg-light text-dark border">
                              {subCategory.subCategoryName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {selectedCategory?.categoryId === category.categoryId ? 'Hide Details' : 'View Details'}
                      </button>
                      <Link
                        to={`/workers?categoryId=${category.categoryId}`}
                        className="btn btn-primary btn-sm"
                      >
                        Find Workers
                      </Link>
                    </div>

                    {selectedCategory?.categoryId === category.categoryId && (
                      <div className="category-details mt-3 pt-3 border-top">
                        <h6 className="fw-bold mb-2">Detailed Skills:</h6>
                        <div className="row g-2">
                          {category.subCategories.map((subCategory) => (
                            <div key={subCategory.subCategoryId} className="col-12">
                              <div className="skill-detail p-2 bg-light rounded">
                                <strong>{subCategory.subCategoryName}</strong>
                                {subCategory.description && (
                                  <p className="small text-muted mb-0 mt-1">
                                    {subCategory.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted">
              <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
              <h5>No categories available</h5>
              <p>Please check back later or contact support.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
