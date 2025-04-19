import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const SocialIcons = () => {
  return (
    <div className="social-links">
      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="GitHub"
      >
        <FaGithub />
      </a>
      <a 
        href="https://twitter.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Twitter"
      >
        <FaTwitter />
      </a>
      <a 
        href="https://linkedin.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="LinkedIn"
      >
        <FaLinkedin />
      </a>
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>
    </div>
  );
};

export default SocialIcons; 