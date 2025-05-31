import {useAuth} from '../../context/auth';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import {Navigate} from 'react-router-dom';

const Dashboard = ({children, isMobile, logout, darkMode, toggleDarkMode}) => {
  const {currentUser} = useAuth();

  if (!currentUser) {
    return <Navigate to="/login"/>;
  }

  return (
      <DashboardLayout roles={currentUser.roles} isMobile={isMobile} darkMode={darkMode} toggleDarkMode={toggleDarkMode} logout={logout}>
            {children}
      </DashboardLayout>
  );
};

export default Dashboard;