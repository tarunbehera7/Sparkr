import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaBook, FaUsers, FaInfoCircle, FaUser, FaSignOutAlt, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StorySpark
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/stories" className="nav-link">Stories</Link>
          <Link to="/content" className="nav-link">Content Library</Link>
          <Link to="/map" className="nav-link">Connect</Link>
          <Link to="/community" className="nav-link">Community</Link>
          <Link to="/chat" className="nav-link">
            <FaComments /> Chat
          </Link>
          <Link to="/about" className="nav-link">About</Link>
          {user ? (
            <div className="user-menu">
              <button className="user-menu-button" onClick={toggleUserMenu}>
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span>{user.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <button onClick={logout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 