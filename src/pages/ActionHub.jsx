import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/ActionHub.css';

const Hub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredResources, setFilteredResources] = useState([]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health' },
    { id: 'tech', name: 'Technology' },
    { id: 'community', name: 'Community' }
  ];

  const resources = [
    {
      id: 1,
      name: 'Green Earth Initiative',
      category: 'environment',
      description: 'Working towards environmental conservation and sustainable development.',
      location: 'New York, USA',
      website: 'https://greenearth.org',
      contact: 'contact@greenearth.org',
      impact: 'Over 1 million trees planted',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Global Education Foundation',
      category: 'education',
      description: 'Providing quality education to underprivileged children worldwide.',
      location: 'London, UK',
      website: 'https://globaledu.org',
      contact: 'info@globaledu.org',
      impact: 'Educated 50,000+ children',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Health for All',
      category: 'health',
      description: 'Improving healthcare access in developing countries.',
      location: 'Geneva, Switzerland',
      website: 'https://healthforall.org',
      contact: 'support@healthforall.org',
      impact: 'Treated 100,000+ patients',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Tech for Good',
      category: 'tech',
      description: 'Using technology to solve social and environmental challenges.',
      location: 'San Francisco, USA',
      website: 'https://techforgood.org',
      contact: 'hello@techforgood.org',
      impact: 'Developed 100+ social impact solutions',
      rating: 4.8
    },
    {
      id: 5,
      name: 'Community Builders Network',
      category: 'community',
      description: 'Strengthening local communities through grassroots initiatives.',
      location: 'Toronto, Canada',
      website: 'https://communitybuilders.org',
      contact: 'connect@communitybuilders.org',
      impact: 'Supported 1,000+ community projects',
      rating: 4.6
    }
  ];

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory]);

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.location.toLowerCase().includes(query)
      );
    }

    setFilteredResources(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="action-hub-page">
      <div className="action-hub-header">
        <h1>Action Hub</h1>
        <p>Find and connect with organizations making a difference</p>
      </div>

      <div className="search-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="resources-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredResources.map(resource => (
          <motion.div
            key={resource.id}
            className="resource-card"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="resource-header">
              <h3>{resource.name}</h3>
              <div className="rating">
                <span>★</span>
                {resource.rating}
              </div>
            </div>

            <p className="resource-description">{resource.description}</p>

            <div className="resource-details">
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span>{resource.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Impact:</span>
                <span>{resource.impact}</span>
              </div>
            </div>

            <div className="resource-actions">
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button website"
              >
                Visit Website
              </a>
              <a
                href={`mailto:${resource.contact}`}
                className="action-button contact"
              >
                Contact
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredResources.length === 0 && (
        <div className="no-results">
          <h3>No organizations found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Hub; 