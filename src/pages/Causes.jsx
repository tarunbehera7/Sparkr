import React, { useState } from 'react';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGlobe } from 'react-icons/fa';

function Causes() {
  const [activeTab, setActiveTab] = useState('featured');

  // Mock data for causes
  const causes = [
    {
      id: 1,
      title: "Environmental Conservation",
      icon: <FaGlobe />,
      description: "Protecting our planet's ecosystems and promoting sustainable practices.",
      impact: "Over 1,000 trees planted and 5,000 kg of waste recycled",
      supporters: 2500,
      status: "active"
    },
    {
      id: 2,
      title: "Education Access",
      icon: <FaUsers />,
      description: "Making quality education accessible to underprivileged communities.",
      impact: "500 students supported with educational resources",
      supporters: 1800,
      status: "active"
    },
    {
      id: 3,
      title: "Healthcare Initiative",
      icon: <FaHandHoldingHeart />,
      description: "Providing healthcare services to remote communities.",
      impact: "Medical camps in 10 villages, reaching 2,000 people",
      supporters: 3200,
      status: "active"
    }
  ];

  return (
    <div className="causes-page">
      <div className="causes-header">
        <h1>Social Causes</h1>
        <p>Join us in making a difference. Explore causes that matter to you.</p>
      </div>

      <div className="causes-tabs">
        <button
          className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          Featured Causes
        </button>
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Causes
        </button>
        <button
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Causes
        </button>
      </div>

      <div className="causes-grid">
        {causes.map(cause => (
          <div key={cause.id} className="cause-card">
            <div className="cause-icon">
              {cause.icon}
            </div>
            <div className="cause-content">
              <h3>{cause.title}</h3>
              <p>{cause.description}</p>
              <div className="cause-impact">
                <h4>Impact</h4>
                <p>{cause.impact}</p>
              </div>
              <div className="cause-stats">
                <div className="stat">
                  <FaHeart />
                  <span>{cause.supporters} Supporters</span>
                </div>
                <div className="stat">
                  <span className={`status ${cause.status}`}>
                    {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="cause-actions">
                <button className="btn btn-primary">Learn More</button>
                <button className="btn btn-secondary">Support Cause</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="causes-footer">
        <button className="btn btn-primary">Start a New Cause</button>
      </div>
    </div>
  );
}

export default Causes; 