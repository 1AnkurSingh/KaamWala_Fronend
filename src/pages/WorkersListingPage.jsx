// src/pages/WorkersListingPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  getWorkersByCategory, 
  getWorkersByLocation, 
  searchWorkers, 
  getAllWorkers 
} from "../services/workerService";
import "./WorkersListingPage.css";

export default function WorkersListingPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minRate: '',
    maxRate: '',
    minExperience: '',
    sortBy: 'name'
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      minRate: searchParams.get('minRate') || '',
      maxRate: searchParams.get('maxRate') || '',
      minExperience: searchParams.get('minExperience') || '',
      sortBy: searchParams.get('sortBy') || 'name'
    };
    
    setFilters(initialFilters);
    loadWorkers(initialFilters, 0, true);
  }, [location.search]);

  const loadWorkers = async (searchFilters = filters, page = 0, reset = false) => {
    try {
      setLoading(true);
      let response;

      // Determine which API to call based on filters
      if (searchFilters.category && !searchFilters.location && !searchFilters.minRate && !searchFilters.maxRate) {
        // Simple category search
        response = await getWorkersByCategory(searchFilters.category, page, 20);
      } else if (searchFilters.location && !searchFilters.category && !searchFilters.minRate && !searchFilters.maxRate) {
        // Simple location search
        response = await getWorkersByLocation(searchFilters.location, page, 20);
      } else if (Object.values(searchFilters).some(value => value)) {
        // Advanced search with multiple filters
        response = await searchWorkers({
          category: searchFilters.category || null,
          location: searchFilters.location || null,
          minRate: searchFilters.minRate ? parseFloat(searchFilters.minRate) : null,
          maxRate: searchFilters.maxRate ? parseFloat(searchFilters.maxRate) : null,
          minExperience: searchFilters.minExperience ? parseInt(searchFilters.minExperience) : null
        }, page, 20, searchFilters.sortBy);
      } else {
        // Get all workers
        response = await getAllWorkers(page, 20, searchFilters.sortBy);
      }

      if (response.data && Array.isArray(response.data)) {
        if (reset) {
          setWorkers(response.data);
        } else {
          setWorkers(prev => [...prev, ...response.data]);
        }
        
        // Check if there are more results
        setHasMore(response.data.length === 20);
        setCurrentPage(page);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading workers:', error);
      toast.error('Failed to load workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    
    // Update URL
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    navigate(`?${searchParams.toString()}`, { replace: true });
    
    // Load workers with new filters
    loadWorkers(newFilters, 0, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadWorkers(filters, currentPage + 1, false);
    }
  };

  const formatWorker = (worker) => ({
    id: worker.userId,
    name: worker.name,
    experience: worker.experience || 0,
    hourlyRate: worker.hourlyRate || 0,
    serviceAreas: worker.serviceAreas || '',
    phone: worker.phone || '',
    imageUrl: worker.imageName ? `/users/image/${worker.userId}` : '/default-avatar.png',
    skills: worker.userSkills ? worker.userSkills.map(skill => skill.subCategoryName) : [],
    rating: 4.5, // Placeholder
    totalJobs: 25, // Placeholder
    availability: 'Available' // Placeholder
  });

  return (
    <div className="workers-listing-page">
      {/* Header */}
      <div className="bg-light py-4 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h3 mb-2">
                {filters.category ? `${filters.category} Workers` : 'Find Workers'}
              </h1>
              <p className="text-muted mb-0">
                {workers.length} workers found
                {filters.location && ` in ${filters.location}`}
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link to="/categories" className="btn btn-outline-primary">
                ← Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="filters-sidebar">
              <h5 className="mb-3">Filter Workers</h5>
              
              {/* Category Filter */}
              <div className="filter-group mb-3">
                <label className="form-label fw-bold">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Plumbing"
                  value={filters.category}
                  onChange={(e) => handleFilterChange({...filters, category: e.target.value})}
                />
              </div>

              {/* Location Filter */}
              <div className="filter-group mb-3">
                <label className="form-label fw-bold">Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Delhi"
                  value={filters.location}
                  onChange={(e) => handleFilterChange({...filters, location: e.target.value})}
                />
              </div>

              {/* Rate Range */}
              <div className="filter-group mb-3">
                <label className="form-label fw-bold">Hourly Rate (₹)</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.minRate}
                      onChange={(e) => handleFilterChange({...filters, minRate: e.target.value})}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.maxRate}
                      onChange={(e) => handleFilterChange({...filters, maxRate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Experience Filter */}
              <div className="filter-group mb-3">
                <label className="form-label fw-bold">Min Experience (Years)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g., 2"
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange({...filters, minExperience: e.target.value})}
                />
              </div>

              {/* Sort By */}
              <div className="filter-group mb-3">
                <label className="form-label fw-bold">Sort By</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
                >
                  <option value="name">Name</option>
                  <option value="hourlyRate">Hourly Rate</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => handleFilterChange({
                  category: '', location: '', minRate: '', maxRate: '', minExperience: '', sortBy: 'name'
                })}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="col-lg-9">
            {loading && workers.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading workers...</span>
                </div>
                <h4 className="mt-3">Finding workers...</h4>
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-5">
                <div className="empty-state">
                  <div className="fs-1 mb-3">👷‍♂️</div>
                  <h4>No workers found</h4>
                  <p className="text-muted">Try adjusting your filters or search criteria</p>
                </div>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {workers.map((worker) => {
                    const formattedWorker = formatWorker(worker);
                    return (
                      <div key={formattedWorker.id} className="col-md-6 col-lg-4">
                        <div className="worker-card card h-100 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex align-items-start mb-3">
                              <img
                                src={formattedWorker.imageUrl}
                                alt={formattedWorker.name}
                                className="worker-avatar rounded-circle me-3"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                              <div className="flex-grow-1">
                                <h5 className="card-title mb-1">{formattedWorker.name}</h5>
                                <div className="text-muted small">
                                  ⭐ {formattedWorker.rating} • {formattedWorker.totalJobs} jobs
                                </div>
                                <span className="badge bg-success-subtle text-success small">
                                  {formattedWorker.availability}
                                </span>
                              </div>
                            </div>

                            <div className="worker-details">
                              <div className="row mb-2">
                                <div className="col-6">
                                  <small className="text-muted">Experience</small>
                                  <div className="fw-bold">{formattedWorker.experience} years</div>
                                </div>
                                <div className="col-6">
                                  <small className="text-muted">Rate</small>
                                  <div className="fw-bold">₹{formattedWorker.hourlyRate}/hr</div>
                                </div>
                              </div>

                              <div className="mb-2">
                                <small className="text-muted">Service Areas</small>
                                <div className="small">{formattedWorker.serviceAreas || 'Multiple locations'}</div>
                              </div>

                              <div className="mb-3">
                                <small className="text-muted">Skills</small>
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                  {formattedWorker.skills.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="badge bg-primary-subtle text-primary small">
                                      {skill}
                                    </span>
                                  ))}
                                  {formattedWorker.skills.length > 3 && (
                                    <span className="badge bg-light text-muted small">
                                      +{formattedWorker.skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card-footer bg-transparent">
                            <div className="d-flex gap-2">
                              <Link
                                to={`/profile/${formattedWorker.id}`}
                                className="btn btn-outline-primary btn-sm flex-grow-1"
                              >
                                View Profile
                              </Link>
                              <button className="btn btn-primary btn-sm flex-grow-1">
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Loading...
                        </>
                      ) : (
                        'Load More Workers'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
