import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import ProfilePage from './pages/Profile';
import HomePage from './pages/Home';
import ProjectPage from './pages/Project';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); 

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {isAuthenticated ? (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/project/:id_of_project" element={<ProjectPage />} />
              <Route path="/" element={<HomePage />} />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
