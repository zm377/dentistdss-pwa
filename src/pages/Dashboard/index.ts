/**
 * Dashboard Page Components
 *
 * This module exports all dashboard page components for easy importing
 * All components are typed React functional components
 */

// Import the main Dashboard component
import Dashboard from './index.tsx';

// Core Dashboard Pages
export { default as OverviewPage } from '../DashboardPages/OverviewPage';
export { default as ChangePasswordPage } from '../DashboardPages/ChangePasswordPage';
export { default as UserProfilePage } from '../DashboardPages/UserProfilePage';
export { default as AppointmentsPage } from '../DashboardPages/AppointmentsPage';
export { default as MessagesPage } from '../DashboardPages/MessagesPage';
export { default as SettingsPage } from '../DashboardPages/SettingsPage';

// Admin Pages
export { default as UserManagementPage } from '../DashboardPages/UserManagementPage';
export { default as ApprovalsPage } from '../DashboardPages/ApprovalsPage';
export { default as HolidayManagementPage } from '../DashboardPages/HolidayManagementPage';
export { default as WorkingHoursPage } from '../DashboardPages/WorkingHoursPage';

// Role-specific Pages
export { default as DentalRecordsPage } from '../DashboardPages/DentalRecordsPage';
export { default as PatientRecordsPage } from '../DashboardPages/PatientRecordsPage';
export { default as ProfilePage } from '../DashboardPages/ProfilePage';
export { default as SchedulePage } from '../DashboardPages/Schedule';
export { default as PatientsPage } from '../DashboardPages/PatientsPage';
export { default as CommunicationsPage } from '../DashboardPages/CommunicationsPage';

// AI Chat Pages
export { default as AIReceptionistPage } from '../DashboardPages/AIReceptionistPage';
export { default as AIDentistPage } from '../DashboardPages/AIDentistPage';
export { default as AISummarizePage } from '../DashboardPages/AISummarizePage';

// Export the main Dashboard component as default
export default Dashboard;
