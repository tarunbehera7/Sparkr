import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Community = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [initialChatUser, setInitialChatUser] = useState(null);

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
  }, [location.search]);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default Community; 