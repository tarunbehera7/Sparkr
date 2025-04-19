import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import './styles/main.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App; 