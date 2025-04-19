import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import mockUsers from '../data/mockUsers';

const Community = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [initialChatUser, setInitialChatUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const userParam = params.get('user');
    
    if (tabParam === 'chat') {
      setActiveTab('chat');
    }
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setInitialChatUser(userData);
      } catch (error) {
        console.error('Error parsing user parameter:', error);
        // Fallback for old format where only name was passed
        setInitialChatUser({ name: decodeURIComponent(userParam) });
      }
    }

    // Use shared mockUsers
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, [location.search]);

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community</h1>
        <p>Connect and chat with other members</p>
      </div>

      <div className="community-nav">
        <button 
          className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`nav-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
      </div>

      <div className="community-content">
        {activeTab === 'members' && (
          <div className="members-list">
            <h2>Community Members</h2>
            {loading ? (
              <div className="loading">Loading members...</div>
            ) : (
              <div className="users-list">
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <div className="interests">
                        {user.interests.map((interest, index) => (
                          <span key={index} className="interest-tag">{interest}</span>
                        ))}
                      </div>
                      <div className="button-group">
                        <button className="connect-button">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community; 