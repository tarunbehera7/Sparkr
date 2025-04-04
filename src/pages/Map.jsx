import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
  const { user } = useAuth();

  const closeButtonStyle = {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0',
    color: '#666',
    transition: 'all 0.2s ease',
    position: 'absolute',
    top: '-8px',
    right: '-8px'
  };

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    const mockUsers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        location: { lat: 40.7128, lng: -74.0060 },
        interests: ['Environmental Protection', 'Education', 'Social Justice'],
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
      },
      {
        id: '2',
        name: 'Michael Chen',
        location: { lat: 34.0522, lng: -118.2437 },
        interests: ['Climate Action', 'Healthcare', 'Technology'],
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        location: { lat: 51.5074, lng: -0.1278 },
        interests: ['Animal Rights', 'Poverty Alleviation', 'Arts'],
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
      },
      {
        id: '4',
        name: 'David Rodriguez',
        location: { lat: 41.9028, lng: 12.4964 },
        interests: ['Immigration Rights', 'Food Security', 'Community Building'],
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'
      },
      {
        id: '5',
        name: 'Aisha Patel',
        location: { lat: 28.6139, lng: 77.2090 },
        interests: ['Women\'s Rights', 'Education', 'Healthcare'],
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
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
                  <img src={mapUser.avatar} alt={mapUser.name} className="user-avatar" />
                  <div className="user-info">
                    <h3>{mapUser.name}</h3>
                    <div className="interests">
                      {mapUser.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">{interest}</span>
                      ))}
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
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {users.map((mapUser) => (
                  <Marker 
                    key={mapUser.id}
                    position={[mapUser.location.lat, mapUser.location.lng]}
                    eventHandlers={{
                      click: () => handleUserClick(mapUser),
                    }}
                  >
                    <Popup>
                      <div className="marker-popup">
                        <div className="popup-header" style={{ position: 'relative' }}>
                          <img src={mapUser.avatar} alt={mapUser.name} className="popup-avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }} />
                          <h3 style={{ fontSize: '14px', margin: '0' }}>{mapUser.name}</h3>
                        </div>
                        <div className="interests" style={{ marginTop: '4px', fontSize: '12px' }}>
                          {mapUser.interests.slice(0, 2).map((interest, index) => (
                            <span key={index} className="interest-tag" style={{ padding: '2px 6px', margin: '0 2px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                              {interest}
                            </span>
                          ))}
                          {mapUser.interests.length > 2 && 
                            <span style={{ fontSize: '11px', color: '#666' }}>+{mapUser.interests.length - 2} more</span>
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

        {selectedUser && (
          <div className="user-details">
            <div className="user-details-header">
              <h2>User Profile</h2>
              <button 
                className="btn-close"
                onClick={() => setSelectedUser(null)}
                style={{
                  ...closeButtonStyle,
                  position: 'static',
                  top: 'auto',
                  right: 'auto',
                  width: '32px',
                  height: '32px',
                  fontSize: '24px'
                }}
              >
                ×
              </button>
            </div>
            <div className="user-profile">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="profile-avatar" />
              <h3>{selectedUser.name}</h3>
              <div className="profile-interests">
                <h4>Interests</h4>
                <div className="interests">
                  {selectedUser.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary">Connect</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Map; 