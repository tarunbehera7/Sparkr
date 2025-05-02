import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ref, push, set, get, onValue, serverTimestamp, remove } from 'firebase/database';
import { database } from '../config/firebase';
import mockUsers from '../data/mockUsers';
import { FaPlus, FaMapMarkerAlt, FaUser, FaMapPin, FaTrash } from 'react-icons/fa';

// Reset all Leaflet default settings
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a single object to hold all our icons to avoid redefinitions
const MapIcons = {
  // Blue icon for people (matches #1d8cfe)
  people: new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  }),
  
  // Green icon for initiatives
  initiatives: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  
  // Default icon for safety
  default: new L.Icon.Default()
};

// Clean up any existing styles that might be causing conflicts
document.addEventListener('DOMContentLoaded', () => {
  // First, remove any cached styles that might be affecting marker colors
  const cacheBuster = Date.now();
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(stylesheet => {
    if (stylesheet.href.includes('leaflet')) {
      const newHref = stylesheet.href.split('?')[0] + '?' + cacheBuster;
      stylesheet.href = newHref;
    }
  });
});

function MapController({ selectedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation.lat, selectedLocation.lng],
        8,
        {
          animate: true,
          duration: 1
        }
      );
    }
  }, [selectedLocation, map]);

  return null;
}

function MapEvents({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', (e) => {
      onMapClick(e);
    });
    
    return () => {
      map.off('click');
    };
  }, [map, onMapClick]);

  return null;
}

// Replace the LegendControl component with a simple one that only shows icons
function LegendControl() {
  const map = useMap();
  
  useEffect(() => {
    // Create the legend div
    const legend = L.control({ position: 'topright' });
    
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4); border: 2px solid rgba(0,0,0,0.2);">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <img src="${MapIcons.people.options.iconUrl}" style="width: 15px; height: 24px; margin-right: 8px;" />
            <span style="font-size: 13px; color: #333;">People Near You</span>
          </div>
          <div style="display: flex; align-items: center;">
            <img src="${MapIcons.initiatives.options.iconUrl}" style="width: 15px; height: 24px; margin-right: 8px;" />
            <span style="font-size: 13px; color: #333;">Initiatives</span>
          </div>
        </div>
      `;
      return div;
    };
    
    legend.addTo(map);
    
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

function Map() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState({});
  const [initiatives, setInitiatives] = useState([]);
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [newInitiative, setNewInitiative] = useState({
    title: '',
    description: '',
    category: '',
    location: null
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapRef = React.useRef(null);
  const legendRef = React.useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [activeTab, setActiveTab] = useState('initiatives');

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
    } 
    catch (error) {
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

  // Load initiatives
  useEffect(() => {
    const initiativesRef = ref(database, 'initiatives');
    return onValue(initiativesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const initiativesList = Object.entries(data).map(([id, initiative]) => ({
          id,
          ...initiative
        }));
        setInitiatives(initiativesList);
      }
    });
  }, []);

  const handleUserClick = (clickedUser) => {
    setSelectedUser(clickedUser);
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

  const handleMapClick = (e) => {
    if (showInitiativeModal) {
      setNewInitiative(prev => ({
        ...prev,
        location: {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }
      }));
    }
  };

  const handleCreateInitiative = async (e) => {
    e.preventDefault();
    
    // Check for user authentication
    if (!user || !user.email) {
      alert('Please sign in to create an initiative');
      return;
    }

    // Validate all required fields
    if (!newInitiative.title || !newInitiative.category || !newInitiative.location) {
      alert('Please fill in all required fields and select a location on the map');
      return;
    }

    try {
      const initiativeRef = ref(database, 'initiatives');
      const newInitiativeRef = push(initiativeRef);
      
      // Create initiative data with fallback values
      const initiativeData = {
        title: newInitiative.title.trim(),
        category: newInitiative.category,
        location: {
          lat: Number(newInitiative.location.lat),
          lng: Number(newInitiative.location.lng)
        },
        creatorId: user.email,
        creatorName: user.name || user.email.split('@')[0] || 'Anonymous',
        createdAt: Date.now()
      };

      // Validate all values are defined before saving
      if (Object.values(initiativeData).some(value => value === undefined)) {
        throw new Error('Some required fields are missing');
      }

      await set(newInitiativeRef, initiativeData);
      
      // Reset form only after successful creation
      setShowInitiativeModal(false);
      setNewInitiative({
        title: '',
        category: '',
        location: null
      });
    } catch (error) {
      console.error('Error creating initiative:', error);
      alert(`Failed to create initiative: ${error.message}`);
    }
  };

  // Separate handler for initiative selection to avoid conflict with user selection
  const handleInitiativeClick = (initiative) => {
    setSelectedInitiative(initiative);
  };

  // Update the handleMapInit function
  const handleMapInit = (map) => {
    mapRef.current = map;
    setMapInstance(map);
  };

  // Update the initiatives effect
  useEffect(() => {
    // Make initiatives available globally for the legend control
    window.mapInitiatives = initiatives.map(initiative => ({
      ...initiative,
      selected: selectedInitiative?.id === initiative.id
    }));
    
    // Update the legend if available
    if (window.updateLegendInitiatives) {
      window.updateLegendInitiatives();
    }
  }, [initiatives, selectedInitiative]);

  // Add function to handle initiative deletion
  const handleDeleteInitiative = async (initiativeId, e) => {
    // Stop the click event from propagating to the card
    e.stopPropagation();
    
    if (!user) {
      alert('Please sign in to delete initiatives');
      return;
    }
    
    try {
      // Check if the user is the creator
      const initiativeRef = ref(database, `initiatives/${initiativeId}`);
      const snapshot = await get(initiativeRef);
      
      if (snapshot.exists()) {
        const initiative = snapshot.val();
        
        if (initiative.creatorId !== user.email) {
          alert('You can only delete your own initiatives');
          return;
        }
        
        // Confirm deletion
        if (window.confirm('Are you sure you want to delete this initiative?')) {
          await remove(initiativeRef);
          
          // If the deleted initiative was selected, clear selection
          if (selectedInitiative && selectedInitiative.id === initiativeId) {
            setSelectedInitiative(null);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting initiative:', error);
      alert('Failed to delete initiative. Please try again.');
    }
  };

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Connect with Like-Minded People</h1>
        <p>Find people with similar interests and causes near you</p>
      </div>

      <div className="map-container">
        <div className="map-sidebar">
          <div className="sidebar-header">
            <div className="tab-buttons">
              <button 
                className={`tab-button ${activeTab === 'initiatives' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('initiatives');
                  setSelectedInitiative(null);
                }}
              >
                <FaMapMarkerAlt /> Initiatives
              </button>
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('profile');
                  setSelectedInitiative(null);
                }}
              >
                <FaUser /> Profile
              </button>
            </div>
          </div>

          <div className="sidebar-content">
            {activeTab === 'initiatives' ? (
              <div className="sidebar-actions">
                <button 
                  className="create-initiative-btn"
                  onClick={() => setShowInitiativeModal(true)}
                >
                  <FaPlus /> Create Initiative
                </button>
              </div>
            ) : (
              <div className="profile-initiatives">
                <h3 className='profile-initiatives-title'>My Initiatives</h3>
                {user ? (
                  <div className="my-initiatives-list">
                    {initiatives
                      .filter(initiative => initiative.creatorId === user.email)
                      .map((initiative) => (
                        <div 
                          key={initiative.id} 
                          className={`my-initiative-card ${selectedInitiative?.id === initiative.id ? 'selected' : ''}`}
                          onClick={() => handleInitiativeClick(initiative)}
                        >
                          <div className="initiative-icon">
                            <FaMapMarkerAlt size={24} color="var(--primary-color)" />
                          </div>
                          <div className="initiative-info">
                            <h3>{initiative.title}</h3>
                            <div className="initiative-category">
                              <span className="category-tag">{initiative.category}</span>
                            </div>
                          </div>
                          <button 
                            className="delete-initiative-btn"
                            onClick={(e) => handleDeleteInitiative(initiative.id, e)}
                            title="Delete initiative"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="login-prompt">
                    Please sign in to view your initiatives
                  </div>
                )}
                {loading ? (
                  <div className="loading">Loading initiatives...</div>
                ) : (
                  <div className="initiatives-list">
                    {initiatives
                      .filter(initiative => initiative.creatorId !== user?.email)
                      .map((initiative) => (
                        <div 
                          key={initiative.id} 
                          className={`initiative-card ${selectedInitiative?.id === initiative.id ? 'selected' : ''}`}
                          onClick={() => handleInitiativeClick(initiative)}
                        >
                          <div className="initiative-icon">
                            <FaMapMarkerAlt size={24} color="var(--primary-color)" />
                          </div>
                          <div className="initiative-info">
                            <h3>{initiative.title}</h3>
                            <div className="initiative-category">
                              <span className="category-tag">{initiative.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Move modal inside map-sidebar */}
          {activeTab === 'initiatives' && showInitiativeModal && (
            <div className="modal-overlay" onClick={() => setShowInitiativeModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* <h2>Create New Initiative</h2> */}
                <form onSubmit={handleCreateInitiative}>
                  <div className="form-group">
                    <label htmlFor="title">Initiative Title</label>
                    <input
                      type="text"
                      id="title"
                      value={newInitiative.title}
                      onChange={(e) => setNewInitiative({...newInitiative, title: e.target.value})}
                      placeholder="e.g., Community Garden Project"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={newInitiative.category}
                      onChange={(e) => setNewInitiative({...newInitiative, category: e.target.value})}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="social">Social Justice</option>
                      <option value="community">Community Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <p className="location-hint">
                      {newInitiative.location 
                        ? `Selected: ${newInitiative.location.lat.toFixed(4)}, ${newInitiative.location.lng.toFixed(4)}`
                        : 'Click on the map to set location'}
                    </p>
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowInitiativeModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={!newInitiative.location}>
                      Create Initiative
                    </button>
                  </div>
                </form>
              </div>
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
                whenCreated={handleMapInit}
              >
                {/* Use the controller with selected location */}
                {selectedUser && (
                  <MapController 
                    selectedLocation={selectedUser.location}
                  />
                )}
                {selectedInitiative && !selectedUser && (
                  <MapController 
                    selectedLocation={selectedInitiative.location}
                  />
                )}
                <MapEvents onMapClick={handleMapClick} />
                <TileLayer
                  url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=5CnDOnQ0UYnkHZvEU0BY"
                  attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                />
                
                <LegendControl />
                
                {/* User markers - always use the people icon */}
                {users.map((mapUser) => (
                  <Marker
                    key={mapUser.id}
                    position={[mapUser.location.lat, mapUser.location.lng]}
                    icon={MapIcons.people}
                    eventHandlers={{
                      click: () => {
                        handleUserClick(mapUser);
                      },
                      mouseover: (e) => {
                        e.target.openPopup();
                      },
                      mouseout: (e) => {
                        e.target.closePopup();
                      }
                    }}
                  >
                    <Popup className={selectedUser?.id === mapUser.id ? 'selected-popup' : ''}>
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

                {/* Initiative markers - always use the initiatives icon */}
                {initiatives.map((initiative) => (
                  <Marker
                    key={initiative.id}
                    position={[initiative.location.lat, initiative.location.lng]}
                    icon={MapIcons.initiatives}
                    eventHandlers={{
                      click: () => {
                        handleInitiativeClick(initiative);
                      }
                    }}
                  >
                    <Popup className={selectedInitiative?.id === initiative.id ? 'selected-popup' : ''}>
                      <div className="initiative-popup">
                        <h3>{initiative.title}</h3>
                        <div className="initiative-category">
                          <span className="category-tag">{initiative.category}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>

        <div className="user-details">
          <h2>People Near You</h2>
          {loading ? (
            <div className="loading">Loading users...</div>
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
      </div>
    </div>
  );
}

export default Map; 