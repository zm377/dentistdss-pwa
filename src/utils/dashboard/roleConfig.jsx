import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MessageIcon from '@mui/icons-material/Message';
import EventIcon from '@mui/icons-material/Event';
import NotesIcon from '@mui/icons-material/Notes';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SummarizeIcon from '@mui/icons-material/Summarize';
// Import page components
import {
  AppointmentsPage,
  MessagesPage,
  UserManagementPage,
  ApprovalsPage,
  SettingsPage,
  OverviewPage,
  DentalRecordsPage,
  PatientRecordsPage,
  ProfilePage,
  PatientsPage,
  CommunicationsPage,
  SchedulePage,
  AIReceptionistPage,
  AIDentistPage,
  AISummarizePage,
} from '../../pages/Dashboard';


// Role metadata configuration
export const roleMeta = {
  PATIENT: {
    label: 'Patient',
    icon: <PersonIcon />,
    color: 'primary',
  },
  DENTIST: {
    label: 'Dentist',
    icon: <MedicalServicesIcon />,
    color: 'secondary',
  },
  CLINIC_ADMIN: {
    label: 'Clinic Admin',
    icon: <AdminPanelSettingsIcon />,
    color: 'warning',
  },
  RECEPTIONIST: {
    label: 'Receptionist',
    icon: <SupportAgentIcon />,
    color: 'info',
  },
  SYSTEM_ADMIN: {
    label: 'System Admin',
    icon: <SettingsIcon />,
    color: 'error',
  },
};

// Navigation sections for each role with route paths and components
export const navigationSections = {
  PATIENT: [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
      component: OverviewPage,
      props: { userRole: 'PATIENT' }
    },
    {
      key: 'appointments',
      label: 'My Appointments',
      icon: <EventIcon />,
      path: '/appointments',
      component: AppointmentsPage,
      props: { userRole: 'PATIENT' }
    },
    {
      key: 'dental-records',
      label: 'Dental Records',
      icon: <HealthAndSafetyIcon />,
      path: '/dental-records',
      component: DentalRecordsPage
    },
    {
      key: 'ai-receptionist',
      label: 'AI Receptionist',
      icon: <SmartToyIcon />,
      path: '/ai-receptionist',
      component: AIReceptionistPage
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      path: '/messages',
      component: MessagesPage
    },
  ],

  DENTIST: [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
      component: OverviewPage,
      props: { userRole: 'DENTIST' }
    },
    {
      key: 'appointments',
      label: 'Appointments',
      icon: <EventIcon />,
      path: '/appointments',
      component: AppointmentsPage,
      props: { userRole: 'DENTIST' }
    },
    {
      key: 'schedule',
      label: 'Schedule',
      icon: <ScheduleIcon />,
      path: '/schedule',
      component: SchedulePage
    },
    {
      key: 'patient-records',
      label: 'Patient Records',
      icon: <NotesIcon />,
      path: '/patient-records',
      component: PatientRecordsPage
    },
    {
      key: 'ai-dentist',
      label: 'AI Dentist',
      icon: <SmartToyIcon />,
      path: '/ai-dentist',
      component: AIDentistPage
    },
    {
      key: 'ai-summarize',
      label: 'AI Summarize',
      icon: <SummarizeIcon />,
      path: '/ai-summarize',
      component: AISummarizePage
    },
    {
      key: 'profile',
      label: 'My Profile',
      icon: <PersonIcon />,
      path: '/profile',
      component: ProfilePage
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      path: '/messages',
      component: MessagesPage
    },
  ],

  CLINIC_ADMIN: [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
      component: OverviewPage
    },
    {
      key: 'staff',
      label: 'Staff Management',
      icon: <PeopleIcon />,
      path: '/staff',
      component: UserManagementPage,
      props: { userRole: 'CLINIC_ADMIN' }
    },
    {
      key: 'approvals',
      label: 'Pending Staff Approvals',
      icon: <PendingActionsIcon />,
      path: '/approvals',
      component: ApprovalsPage,
      props: { userRole: 'CLINIC_ADMIN' }
    },
    {
      key: 'settings',
      label: 'Clinic Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      component: SettingsPage,
      props: { userRole: 'CLINIC_ADMIN' }
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      path: '/messages',
      component: MessagesPage
    },
  ],

  RECEPTIONIST: [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
      component: OverviewPage,
      props: { userRole: 'RECEPTIONIST' }
    },
    {
      key: 'appointments',
      label: 'Appointments',
      icon: <EventAvailableIcon />,
      path: '/appointments',
      component: AppointmentsPage,
      props: { userRole: 'RECEPTIONIST' }
    },
    {
      key: 'patients',
      label: 'Patients',
      icon: <PeopleAltIcon />,
      path: '/patients',
      component: PatientsPage
    },
    {
      key: 'communications',
      label: 'Communications',
      icon: <MessageIcon />,
      path: '/communications',
      component: CommunicationsPage
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      path: '/messages',
      component: MessagesPage
    },
  ],

  SYSTEM_ADMIN: [
    {
      key: 'overview',
      label: 'Overview',
      icon: <DashboardIcon />,
      path: '/overview',
      component: OverviewPage,
      props: { userRole: 'SYSTEM_ADMIN' }
    },
    {
      key: 'approvals',
      label: 'Pending Approvals',
      icon: <PendingActionsIcon />,
      path: '/approvals',
      component: ApprovalsPage,
      props: { userRole: 'SYSTEM_ADMIN' }
    },
    {
      key: 'users',
      label: 'System Users',
      icon: <PeopleIcon />,
      path: '/users',
      component: UserManagementPage,
      props: { userRole: 'SYSTEM_ADMIN' }
    },
    {
      key: 'settings',
      label: 'System Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      component: SettingsPage,
      props: { userRole: 'SYSTEM_ADMIN' }
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: <MessageIcon />,
      path: '/messages',
      component: MessagesPage
    },
  ],
};

/**
 * Get navigation sections for a specific role
 * @param {string} role - Role key
 * @returns {Array} Navigation sections
 */
export const getRoleNavigationSections = (role) => {
  return navigationSections[role] || [];
};

/**
 * Get role metadata
 * @param {string} role - Role key
 * @returns {Object} Role metadata
 */
export const getRoleMeta = (role) => {
  return roleMeta[role] || { label: role, icon: <PersonIcon />, color: 'default' };
};

/**
 * Get all available roles
 * @returns {Array} Array of role keys
 */
export const getAllRoles = () => {
  return Object.keys(roleMeta);
};

/**
 * Check if role exists
 * @param {string} role - Role key
 * @returns {boolean} Role exists
 */
export const isValidRole = (role) => {
  return Object.keys(roleMeta).includes(role);
};

/**
 * Get default section for a role
 * @param {string} role - Role key
 * @returns {string} Default section key
 */
export const getDefaultSection = (role) => {
  const sections = getRoleNavigationSections(role);
  return sections.length > 0 ? sections[0].key : null;
};

/**
 * Find section by key in role's navigation
 * @param {string} role - Role key
 * @param {string} sectionKey - Section key
 * @returns {Object|null} Section object or null
 */
export const findSection = (role, sectionKey) => {
  const sections = getRoleNavigationSections(role);
  return sections.find(section => section.key === sectionKey) || null;
};

/**
 * Get all unique routes for all roles
 * @returns {Array} Array of route objects
 */
export const getAllRoutes = () => {
  const routeMap = new Map();

  Object.values(navigationSections).forEach(sections => {
    sections.forEach(section => {
      if (!routeMap.has(section.path)) {
        routeMap.set(section.path, {
          path: section.path,
          component: section.component,
          key: section.key,
          props: section.props || {}
        });
      }
    });
  });

  return Array.from(routeMap.values());
};

/**
 * Get routes for a specific role
 * @param {string} role - Role key
 * @returns {Array} Array of route objects for the role
 */
export const getRoleRoutes = (role) => {
  const sections = getRoleNavigationSections(role);
  return sections.map(section => ({
    path: section.path,
    component: section.component,
    key: section.key,
    props: section.props || {}
  }));
};

/**
 * Check if user has access to a specific route
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean} Has access
 */
export const hasRouteAccess = (role, path) => {
  const sections = getRoleNavigationSections(role);
  return sections.some(section => section.path === path);
};
