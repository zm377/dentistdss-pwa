import React from 'react';
import { useAuth } from '../../context/AuthContext'; // To get user roles
import DashboardLayout from './DashboardLayout';
import { Navigate } from 'react-router-dom';


const Dashboard = ({ children, isMobile, darkMode, toggleDarkMode, logout }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else {
    return (
      <DashboardLayout roles={currentUser.roles} isMobile={isMobile} darkMode={darkMode} toggleDarkMode={toggleDarkMode} logout={logout}>
        {children}
      </DashboardLayout>
      );
  }
};

export default Dashboard; 