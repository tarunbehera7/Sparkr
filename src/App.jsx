import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Community from './pages/Community';
import About from './pages/About';
import ContentLibrary from './pages/ContentLibrary';
import LoginPage from './pages/LoginPage';
import Map from './pages/Map';
import GroupChat from './components/GroupChat';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/content" element={<ContentLibrary />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/map" element={<Map />} />
            <Route path="/chat" element={<GroupChat />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 