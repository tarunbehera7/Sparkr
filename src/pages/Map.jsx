import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ref, push, set, get, onValue, serverTimestamp } from 'firebase/database';
import { database } from '../config/firebase';
import mockUsers from '../data/mockUsers';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add this after the L.Icon.Default.mergeOptions code
const defaultIcon = new L.Icon.Default();
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ selectedUser }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedUser) {
      map.setView(
        [selectedUser.location.lat, selectedUser.location.lng],
        5,  // Fixed zoom level when selecting a user
        {
          animate: true,
          duration: 1
        }
      );
    }
  }, [selectedUser, map]);

  return null;
}

function Map() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  // Add a function to clear connections for a new user
  const clearExistingConnections = async () => {
    if (!user) return;
    
    try {
      const connectionsRef = ref(database, `connections/${user.uid}`);
      const snapshot = await get(connectionsRef);
      
      if (snapshot.exists()) {
        console.log('Clearing existing connections for new user');
        await set(connectionsRef, null);
        setConnections({});
      }
    } catch (error) {
      console.error('Error clearing connections:', error);
    }
  };

  const closeButtonStyle = {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0',
    color: '#666',
    transition: 'all 0.2s ease',
  };

  // Mock data for demonstration
  useEffect(() => {
    // Use shared mockUsers
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    // Clear existing connections when a new user signs in
    if (user) {
      clearExistingConnections();
    }

    // Load existing connections
    if (user) {
      const connectionsRef = ref(database, `connections/${user.uid}`);
      
      return onValue(connectionsRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Loaded connections data:', data); // Debug log
        
        if (data && typeof data === 'object') {
          // Only include valid, explicitly created connections
          const validConnections = {};
          Object.entries(data).forEach(([key, value]) => {
            // Ensure this is a valid connection with all required fields
            if (value && 
                value.userId && 
                value.name && 
                value.timestamp && 
                value.roomId &&
                value.isExplicitlyConnected === true) { // Ensure only explicit connections are included
              validConnections[value.userId] = value;
            }
          });
          console.log('Valid connections:', validConnections); // Debug log
          setConnections(validConnections);
        } else {
          console.log('No connections found or invalid data format'); // Debug log
          setConnections({});
        }
      });
    } else {
      setConnections({});
    }
  }, [user]);

  const handleUserClick = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  // Handle connect to navigate to community chat
  const handleConnectAndChat = async (targetUser) => {
    if (!user) {
      alert('Please sign in to connect with other users');
      return;
    }

    try {
      console.log('Starting connect and chat process with user:', targetUser);
      
      // First connect with the user
      const connectionSuccess = await handleConnect(targetUser);
      console.log('Connection result:', connectionSuccess);
      
      if (connectionSuccess) {
        // Then navigate to the community page with chat tab active and user parameter
        const userParam = encodeURIComponent(JSON.stringify({
          id: targetUser.id,
          name: targetUser.name,
          avatar: targetUser.avatar
        }));
        console.log('Navigating to community page with user param:', userParam);
        
        // Force scroll to top before navigation
        window.scrollTo(0, 0);
        navigate(`/community?tab=chat&user=${userParam}`, { 
          state: { scrollToTop: true } 
        });
      } 
      else {
        console.log('Connection failed, not navigating');
      }
    } catch (error) {
      console.error('Error in connect and chat process:', error);
      // Don't show an alert here since handleConnect already shows one if needed
    }
  };

  const handleConnect = async (targetUser) => {
    if (!user) {
      alert('Please log in to connect with other users!');
      return false;
    }

    try {
      console.log('Starting connection process with user:', targetUser);
      
      // Check if connection already exists
      const existingConnection = connections && typeof connections === 'object' && connections[targetUser.id];
      console.log('Existing connection:', existingConnection);

      if (!existingConnection) {
        // Create a unique room ID for the private chat
        const roomId = `private_${[user.uid, targetUser.id].sort().join('_')}`;
        console.log('Creating new room with ID:', roomId);
        
        // Create connection object with all required fields
        const newConnection = {
          userId: targetUser.id,
          name: targetUser.name || 'Anonymous',
          avatar: targetUser.avatar || `https://ui-avatars.com/api/?name=${targetUser.name || 'Anonymous'}&background=random`,
          roomId: roomId,
          timestamp: serverTimestamp(),
          isExplicitlyConnected: true
        };
        console.log('New connection object:', newConnection);

        // Add to user's connections
        const userConnectionsRef = ref(database, `connections/${user.uid}/${targetUser.id}`);
        console.log('Setting user connection at path:', `connections/${user.uid}/${targetUser.id}`);
        await set(userConnectionsRef, newConnection);
        console.log('User connection set successfully');

        // Add to target user's connections (reverse connection)
        const targetConnectionsRef = ref(database, `connections/${targetUser.id}/${user.uid}`);
        const reverseConnection = {
          userId: user.uid,
          name: user.displayName || user.name || 'Anonymous',
          avatar: user.photoURL || user.avatar || `https://ui-avatars.com/api/?name=${user.displayName || user.name || 'Anonymous'}&background=random`,
          roomId: roomId,
          timestamp: serverTimestamp(),
          isExplicitlyConnected: true
        };
        console.log('Setting target connection at path:', `connections/${targetUser.id}/${user.uid}`);
        await set(targetConnectionsRef, reverseConnection);
        console.log('Target connection set successfully');

        // Update local state
        setConnections(prev => {
          const updated = { ...prev, [targetUser.id]: newConnection };
          console.log('Updated connections state:', updated);
          return updated;
        });

        // Initialize private chat room
        const chatRef = ref(database, `privateMessages/${roomId}`);
        console.log('Initializing chat room at path:', `privateMessages/${roomId}`);
        await set(chatRef, {
          initialized: true,
          participants: [user.uid, targetUser.id],
          createdAt: serverTimestamp()
        });
        console.log('Chat room initialized successfully');

        // Open the private chat
        handleUserClick(targetUser);
        console.log('Connection process completed successfully');
        return true;
      } else {
        // If connection exists, just open the chat
        console.log('Connection already exists, opening chat');
        handleUserClick(targetUser);
        return true;
      }
    } catch (error) {
      console.error('Error connecting with user:', error);
      console.error('Error details:', error.message, error.stack);
      // Only show alert if it's a real error, not just a warning
      if (error.message && !error.message.includes('undefined')) {
        alert('Failed to connect with user. Please try again.');
      }
      return false;
    }
  };

  const isConnected = (targetUserId) => {
    // Only return true if the connection exists and was explicitly created
    const connected = Boolean(
      connections && 
      typeof connections === 'object' && 
      connections[targetUserId] && 
      connections[targetUserId].isExplicitlyConnected === true
    );
    
    console.log(`Checking connection for ${targetUserId}:`, connected); // Debug log
    return connected;
  };

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Connect with Like-Minded People</h1>
        <p>Find people with similar interests and causes near you</p>
      </div>

      <div className="map-container">
        <div className="map-sidebar">
          <h2>People Near You</h2>
          {loading ? (
            <div className="loading">Loading map data...</div>
          ) : (
            <div className="users-list">
              {users.map((mapUser) => (
                <div 
                  key={mapUser.id} 
                  className={`user-card ${selectedUser?.id === mapUser.id ? 'selected' : ''}`}
                  onClick={() => handleUserClick(mapUser)}
                >
                  <div className="user-avatar">
                    {mapUser.name.charAt(0)}
                  </div>
                  <div className="user-info">
                    <h3>{mapUser.name}</h3>
                    <div className="interests">
                      {mapUser.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
                    </div>
                    <div className="button-group">
                      {user ? (
                        user.uid !== mapUser.id ? (
                          <>
                            <button
                              className={`connect-button ${isConnected(mapUser.id) ? 'connected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isConnected(mapUser.id)) {
                                  handleConnect(mapUser);
                                }
                              }}
                              disabled={isConnected(mapUser.id)}
                            >
                              {isConnected(mapUser.id) ? 'Connected' : 'Connect'}
                            </button>
                          </>
                        ) : (
                          <button className="connect-button" disabled>
                            This is you
                          </button>
                        )
                      ) : (
                        <button
                          className="connect-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Please sign in to connect with other users');
                          }}
                        >
                          Sign in to Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="map-view">
          {loading ? (
            <div className="map-placeholder">Loading map...</div>
          ) : (
            <div className="map-visualization">
              <MapContainer 
                center={[30, 0]} 
                zoom={3} 
                minZoom={2}
                maxBounds={[[-90, -180], [90, 180]]}
                style={{ height: '100%', width: '100%' }}
              >
                <MapController selectedUser={selectedUser} />
                <TileLayer
                  url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=5CnDOnQ0UYnkHZvEU0BY"
                  attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                />
                {users.map((mapUser) => (
                  <Marker
                    key={mapUser.id}
                    position={[mapUser.location.lat, mapUser.location.lng]}
                    icon={selectedUser?.id === mapUser.id ? selectedIcon : defaultIcon}
                    eventHandlers={{
                      click: () => handleUserClick(mapUser),
                      mouseover: (e) => {
                        e.target.openPopup();
                      },
                      mouseout: (e) => {
                        e.target.closePopup();
                      }
                    }}
                  >
                    <Popup>
                      <div className="marker-popup">
                        <div className="popup-header">
                          <div 
                            className="popup-avatar"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: 'var(--primary-color)',
                              color: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {mapUser.name.charAt(0)}
                          </div>
                          <h3>{mapUser.name}</h3>
                        </div>
                        <div className="interests">
                          {mapUser.interests.slice(0, 2).map((interest, index) => (
                            <span key={index} className="interest-tag">{interest}</span>
                          ))}
                          {mapUser.interests.length > 2 && 
                            <span className="more-interests">+{mapUser.interests.length - 2} more</span>
                          }
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>

        <div className={`user-details ${selectedUser ? 'visible' : ''}`}>
          {selectedUser ? (
            <>
              <div className="user-details-header">
                <h2>User Profile</h2>
                <button 
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                  style={closeButtonStyle}
                >
                  ×
                </button>
              </div>
              <div className="user-profile">
                <div className="profile-avatar">
                  {selectedUser.name.charAt(0)}
                </div>
                <h3>{selectedUser.name}</h3>
                <div className="profile-interests">
                  <h4>Interests</h4>
                  <div className="interests">
                    {selectedUser.interests.map((interest, index) => (
                      <span key={index} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
                <div className="profile-actions">
                  {user ? (
                    user.uid !== selectedUser.id ? (
                      <>
                        <button 
                          className={`connect-button ${isConnected(selectedUser.id) ? 'connected' : ''}`}
                          onClick={() => !isConnected(selectedUser.id) && handleConnect(selectedUser)}
                          disabled={isConnected(selectedUser.id)}
                        >
                          {isConnected(selectedUser.id) ? 'Connected' : 'Connect'}
                        </button>
                      </>
                    ) : (
                      <button className="connect-button" disabled>
                        This is you
                      </button>
                    )
                  ) : (
                    <button 
                      className="connect-button"
                      onClick={() => {
                        alert('Please sign in to connect with other users');
                      }}
                    >
                      Sign in to Connect
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-profile">
              <h2>User Profile</h2>
              <p>Select a user to view their profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map; 