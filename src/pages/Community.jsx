import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaUserPlus, FaSearch } from 'react-icons/fa';
import Discussion from '../components/Discussion';

const Community = () => {
  const [activeSection, setActiveSection] = useState('discussions');
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Environmental Activist",
      avatar: "JD",
      discussions: 12,
      contributions: 48
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Education Advocate",
      avatar: "JS",
      discussions: 8,
      contributions: 36
    }
  ]);
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Climate Action Initiatives",
      category: "environment",
      author: "John Doe",
      participants: 5,
      lastActive: "2h ago"
    },
    {
      id: 2,
      title: "Education for All Campaign",
      category: "education",
      author: "Jane Smith",
      participants: 8,
      lastActive: "1h ago"
    }
  ]);

  // Load members and discussions from localStorage on mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('community-members');
    const savedDiscussions = localStorage.getItem('community-discussions');
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    if (savedDiscussions) {
      setDiscussions(JSON.parse(savedDiscussions));
    }
  }, []);

  // Save members and discussions to localStorage when updated
  useEffect(() => {
    localStorage.setItem('community-members', JSON.stringify(members));
    localStorage.setItem('community-discussions', JSON.stringify(discussions));
  }, [members, discussions]);

  const handleStartDiscussion = () => {
    setSelectedDiscussion(null);
    setShowDiscussion(true);
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowDiscussion(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('fullName');
    const interests = formData.get('interests');
    const mainInterest = interests.split(',')[0].trim();

    // Create new member
    const newMember = {
      id: Date.now(),
      name: name,
      role: mainInterest || 'Community Member',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      discussions: 1, // Starting with 1 discussion
      contributions: 0
    };

    // Create a new discussion based on their interest
    const newDiscussion = {
      id: Date.now() + 1,
      title: `${mainInterest} Discussion Group`,
      category: mainInterest.toLowerCase(),
      author: name,
      participants: 1,
      lastActive: new Date().toLocaleString()
    };

    // Add new member to the list
    setMembers(prevMembers => [...prevMembers, newMember]);
    
    // Add new discussion to the list
    setDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);

    // Clear form
    e.target.reset();
    
    // Switch to discussions section to show the new discussion
    setActiveSection('discussions');
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community Hub</h1>
        <p>Connect, collaborate, and make an impact together</p>
      </div>

      <div className="community-nav">
        <button
          className={`nav-btn ${activeSection === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveSection('discussions')}
        >
          <FaComments /> Discussions
        </button>
        <button
          className={`nav-btn ${activeSection === 'members' ? 'active' : ''}`}
          onClick={() => setActiveSection('members')}
        >
          <FaUsers /> Members
        </button>
        <button
          className={`nav-btn ${activeSection === 'join' ? 'active' : ''}`}
          onClick={() => setActiveSection('join')}
        >
          <FaUserPlus /> Join Us
        </button>
        <button
          className="btn btn-primary"
          onClick={handleStartDiscussion}
        >
          Start Discussion
        </button>
      </div>

      {(activeSection === 'discussions' || activeSection === 'members') && (
        <div className="search-section">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder={`Search ${activeSection}...`}
            />
          </div>
        </div>
      )}

      {activeSection === 'discussions' && (
        <div className="discussions-list">
          {discussions.map(discussion => (
            <div 
              key={discussion.id} 
              className="discussion-card" 
              onClick={() => handleDiscussionClick(discussion)}
            >
              <div className="discussion-main">
                <div className="discussion-info">
                  <h3>{discussion.title}</h3>
                  <div className="discussion-meta">
                    <span>Started by {discussion.author}</span>
                    <span>•</span>
                    <span>{discussion.participants} participants</span>
                    <span>•</span>
                    <span>Last active {discussion.lastActive}</span>
                  </div>
                </div>
                <span className="category">{discussion.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'members' && (
        <div className="members-list">
          {members.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <div className="member-stats">
                  <span>{member.discussions} discussions</span>
                  <span>•</span>
                  <span>{member.contributions} contributions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'join' && (
        <div className="join-section">
          <div className="join-content">
            <h2>Join Our Community</h2>
            <p>Be part of a growing network of changemakers</p>
            <form className="join-form" onSubmit={handleJoinSubmit}>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name" 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                required 
              />
              <textarea 
                name="interests" 
                placeholder="Tell us about yourself and your interests (e.g., Health, Technology, Education)"
                required
              ></textarea>
              <button type="submit" className="btn btn-primary">Join Now</button>
            </form>
          </div>
        </div>
      )}

      {showDiscussion && (
        <Discussion 
          onClose={() => setShowDiscussion(false)} 
          initialRoom={selectedDiscussion?.category || 'general'}
        />
      )}
    </div>
  );
};

export default Community; 