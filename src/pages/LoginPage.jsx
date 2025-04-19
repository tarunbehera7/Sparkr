import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create a user object with avatar and name
      const userData = {
        email,
        name: email.split('@')[0], // Using email username as display name
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`, // Generate avatar from name
      };
      await login(userData);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture || `https://ui-avatars.com/api/?name=${decoded.name}&background=random`,
      };
      await loginWithGoogle(userData);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    setError('Failed to sign in with Google');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner">↻</span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="google-signin">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              type="standard"
              theme="filled_blue"
              size="large"
              width="250"
              text="signin_with"
              shape="rectangular"
            />
          </div>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account?</p>
          <a href="/login">Create an account</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 