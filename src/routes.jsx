import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Community from './pages/Community';
import About from './pages/About';
import ContentLibrary from './pages/ContentLibrary';
import LoginPage from './pages/LoginPage';
import Map from './pages/Map';
import GroupChat from './components/GroupChat';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<About />} />
      <Route path="/content" element={<ContentLibrary />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/map" element={<Map />} />
    </Routes>
  );
};

export default AppRoutes; 