// client/src/components/TopNavDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopNavDashboard = () => {
  const navigate = useNavigate(); // Used to redirect after logging out
  const { logout } = useAuth(); // Access logout function from context

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the landing page
  };

  return (
    <nav className="top-navbar">
      <Link className="link-dash" to="/" id='ls-nav'><span>Text Adventure Game for Education:</span> Dashboard</Link>
      <Link className="link-dash" to="/" id='ss-nav'>Dashboard</Link>
      <button onClick={handleLogout}><i class="fas fa-sign-out"></i>Logout</button>
    </nav>
  );
};

export default TopNavDashboard;
