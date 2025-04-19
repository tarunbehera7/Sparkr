import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaBook, FaUsers, FaInfoCircle, FaUser, FaSignOutAlt, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = () => {
    // Only scroll to top if not on the Community page
    // if (!location.pathname.includes('/community')) {
    //   window.scrollTo(0, 0);
    // }
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleNavClick}>
          Sparkr
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* <Link to="/stories" className="nav-link">Stories</Link>
          <Link to="/content" className="nav-link">Content Library</Link>
          <Link to="/map" className="nav-link">Connect</Link>
          <Link to="/community" className="nav-link">Community</Link> */}
          <Link to="/stories" className="nav-link" onClick={handleNavClick}>Stories</Link>
          <Link to="/content" className="nav-link" onClick={handleNavClick}>Content Library</Link>
          <Link to="/map" className="nav-link" onClick={handleNavClick}>Connect</Link>
          <Link to="/discover" className="nav-link" onClick={handleNavClick}>Discover</Link>
          <Link to="/hub" className="nav-link" onClick={handleNavClick}>Hub</Link>
          <Link to="/community" className="nav-link" onClick={handleNavClick}>Community</Link>
          {user ? (
            <div className="user-menu">
              <a href="#" className="user-menu-button" onClick={(e) => {
                e.preventDefault();
                toggleUserMenu();
              }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="user-avatar" 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                  }}
                />
              </a>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={handleNavClick}>
                    <FaUser /> Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link" onClick={handleNavClick}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;