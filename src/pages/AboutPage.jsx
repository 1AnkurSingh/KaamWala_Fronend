import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">About KaamWala</h1>
              <p className="lead mb-4">
                Empowering local workers and connecting communities through technology
              </p>
              <p className="fs-5">
                KaamWala is more than just a platform—it's a movement to digitize and empower 
                the local workforce while making quality services accessible to everyone.
              </p>
            </div>
            <div className="col-lg-6">
              <img 
                src="/api/placeholder/500/400" 
                alt="About KaamWala" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title mb-4">Our Mission</h2>
              <p className="lead mb-4">
                To create a transparent, fair, and efficient marketplace that connects 
                skilled workers directly with customers, eliminating middlemen and 
                ensuring fair compensation for quality work.
              </p>
            </div>
          </div>
          
          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="fas fa-handshake fa-3x text-primary"></i>
                </div>
                <h4>Direct Connection</h4>
                <p>Connect workers and customers directly without intermediaries</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="fas fa-balance-scale fa-3x text-success"></i>
                </div>
                <h4>Fair Pricing</h4>
                <p>Ensure fair compensation for workers and reasonable prices for customers</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="fas fa-shield-alt fa-3x text-info"></i>
                </div>
                <h4>Trust & Safety</h4>
                <p>Build a trusted community through verification and ratings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img 
                src="/api/placeholder/500/350" 
                alt="Our Story" 
                className="img-fluid rounded-3"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="section-title mb-4">Our Story</h2>
              <p className="mb-3">
                KaamWala was born from a simple observation: in today's digital age, 
                every household has a smartphone, but finding reliable local services 
                remains challenging.
              </p>
              <p className="mb-3">
                We noticed that skilled workers like plumbers, electricians, and carpenters 
                often struggle to find consistent work, while customers struggle to find 
                trusted service providers. Traditional methods involve high commissions 
                and lack transparency.
              </p>
              <p className="mb-4">
                Our platform bridges this gap by creating a direct connection between 
                service providers and customers, ensuring fair prices, quality work, 
                and mutual trust.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register/worker" className="btn btn-primary">
                  Join as Worker
                </Link>
                <Link to="/register/customer" className="btn btn-outline-primary">
                  Find Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart text-danger"></i>
                </div>
                <h5>Empowerment</h5>
                <p>Empowering local workers to grow their businesses and earn fairly</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-eye text-primary"></i>
                </div>
                <h5>Transparency</h5>
                <p>Complete transparency in pricing, ratings, and service delivery</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users text-success"></i>
                </div>
                <h5>Community</h5>
                <p>Building strong local communities through trusted connections</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-star text-warning"></i>
                </div>
                <h5>Quality</h5>
                <p>Committed to delivering high-quality services and experiences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle">Meet the people behind KaamWala</p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team-card text-center">
                <div className="team-avatar mb-3">
                  <img 
                    src="/api/placeholder/150/150" 
                    alt="Founder" 
                    className="rounded-circle img-fluid"
                  />
                </div>
                <h5>KaamWala Team</h5>
                <p className="text-muted">Founder & Developer</p>
                <p className="small">
                  Passionate about technology and social impact, building solutions 
                  that make a real difference in people's lives.
                </p>
                <div className="social-links">
                  <a href="#" className="text-primary me-2">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-dark me-2">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="text-info">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-3">Ready to Join KaamWala?</h2>
          <p className="mb-4 fs-5">
            Whether you're looking for work or need services, we're here to help
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register/worker" className="btn btn-light btn-lg">
              <i className="fas fa-briefcase me-2"></i>Start Working
            </Link>
            <Link to="/register/customer" className="btn btn-outline-light btn-lg">
              <i className="fas fa-search me-2"></i>Find Services
            </Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">
              <i className="fas fa-envelope me-2"></i>Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
