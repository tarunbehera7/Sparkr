import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="brand-section">
          <div className="footer-logo">
            <span className="logo-text">Sparkr</span>
          </div>
          <p className="brand-description">
            Empowering developers to build and share open source projects. Join our community of innovators.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Platform</h3>
          <ul>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contribute">Contribute</Link></li>
            <li><Link to="/learn">Learn</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/partners">Partners</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Stay Connected</h3>
          <p>Subscribe to our newsletter for updates and insights.</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button type="submit" className="subscribe-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} <span className="brand-name">Sparkr</span> Platform. All rights reserved.
        </p>
        <div className="footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 