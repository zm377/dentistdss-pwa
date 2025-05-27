import React from 'react';
import { useAuth } from '../../context/AuthContext'; // To get user roles
import MultiRoleDashboardLayout from './DashboardLayout';
import { Navigate } from 'react-router-dom';


const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login"/>;
  } else {
    return <MultiRoleDashboardLayout roles={currentUser.roles} />;
  }
};

export default Dashboard; 