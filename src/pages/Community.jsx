import React, { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaUserPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Discussion from '../components/Discussion';
import GroupChat from '../components/GroupChat';
import { useLocation } from 'react-router-dom';
import '../styles/Community.css';

// Mock member data
const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
    interests: ["Environmental Protection", "Education", "Social Justice"]
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
    interests: ["Climate Action", "Healthcare", "Technology"]
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "https://ui-avatars.com/api/?name=Emma+Wilson&background=random",
    interests: ["Animal Rights", "Poverty Alleviation", "Arts"]
  },
  {
    id: 4,
    name: "David Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=David+Rodriguez&background=random",
    interests: ["Immigration Rights", "Food Security", "Community Building"]
  },
  {
    id: 5,
    name: "Aisha Patel",
    avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
    interests: ["Women's Rights", "Education", "Healthcare"]
  }
];

const Community = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Developer',
      avatar: '/images/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Designer',
      avatar: '/images/avatar2.jpg'
    }
  ]);
  const [discussions, setDiscussions] = useState([]);
  const [initialChatUser, setInitialChatUser] = useState(null);
  const [error, setError] = useState(null);

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const userParam = params.get('user');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (userParam) {
      setInitialChatUser(userParam);
    }
  }, [location]);

  // Fetch members and discussions from backend on mount
  useEffect(() => {
    if (user) {
      // Create current user data
      const currentUser = {
        id: 'current',
        name: user.name,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
        interests: ["Social Impact", "Community"]
      };

      setMembers(prevMembers => {
        const currentUserExists = prevMembers.some(member => member.id === 'current');
        if (currentUserExists) {
          return prevMembers;
        } else {
          return [currentUser, ...prevMembers];
        }
      });
    }

    const fetchDiscussions = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/community/discussions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        setError('Failed to load discussions. Please try again.');
      }
    };
    fetchDiscussions();
  }, [user]);

  useEffect(() => {
    // Check if we should scroll to top based on navigation state
    if (location.state?.scrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [location]);

  const handleStartDiscussion = () => {
    setSelectedDiscussion(null);
    setShowDiscussion(true);
  };

  const handleDiscussionClick = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowDiscussion(true);
  };

  const handleJoin = async () => {
    if (!user) {
      alert('Please log in to join the community!');
      return;
    }

    const newMember = {
      id: user.id || Date.now(),
      name: user.name,
      role: 'Community Member',
      avatar: user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      discussions: 0,
      contributions: 0,
    };

    try {
      const response = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      const updatedMembers = await response.json();
      setMembers(updatedMembers);
      setActiveTab('members');
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community</h1>
        <p>Connect and chat with other members</p>
      </div>

      <div className="community-tabs">
        <button
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <FaComments /> Chat
        </button>
        <button
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <FaUsers /> Members
        </button>
      </div>

      <div className="community-content">
        {activeTab === 'chat' ? (
          <GroupChat initialUser={initialChatUser} />
        ) : (
          <div className="members-list">
            <h2>Community Members</h2>
            <div className="members-grid">
              {members.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-header">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="member-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=random`;
                      }}
                    />
                    {member.id === 'current' && (
                      <span className="current-user-badge">You</span>
                    )}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    {member.interests && member.interests.length > 0 && (
                      <div className="member-interests">
                        {member.interests.map((interest, index) => (
                          <span key={index} className="interest-tag">
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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