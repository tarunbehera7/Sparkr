import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to StorySpark</h1>
          <p>Connect, Share, and Make a Difference</p>
          <div className="hero-buttons">
            <Link to="/stories" className="btn btn-primary">Explore Stories</Link>
            <Link to="/content" className="btn btn-secondary">Browse Content</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Share Your Story</h3>
              <p>Connect with others through meaningful stories and experiences.</p>
            </div>
            <div className="feature-card">
              <h3>Learn & Grow</h3>
              <p>Access curated content and resources to expand your knowledge.</p>
            </div>
            <div className="feature-card">
              <h3>Join the Community</h3>
              <p>Connect with like-minded individuals and make a difference together.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 