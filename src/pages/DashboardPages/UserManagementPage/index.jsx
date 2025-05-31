import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ListItem,
  Chip,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import {
  ListCard,
  ActionButton,
} from '../../../components/Dashboard/shared';
import {
  mockSystemAdminSystemUsersData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';
import { roleMapping } from '../../../utils/dictionary';
import api from '../../../services';

/**
 * UserManagementPage - Unified user/staff management page
 *
 * Features:
 * - System Users view for System Admin
 * - Staff Management view for Clinic Admin
 * - Reusable user list functionality
 */
const UserManagementPage = ({ userRole = 'SYSTEM_ADMIN', clinicId = null }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');

      try {
        let data;
        if (userRole === 'SYSTEM_ADMIN') {
          // Load all system users
          data = await api.user.getAllUsers();
        } else if (userRole === 'CLINIC_ADMIN') {
          // Load clinic staff only
          data = await api.user.getAllUsers();
          // Filter by clinic if needed
          if (clinicId) {
            data = data.filter(user => user.clinicId === clinicId);
          }
        } else {
          // Fallback to mock data
          data = await simulateApiCall(mockSystemAdminSystemUsersData);
        }
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users. Please try again later.');
        // Fallback to mock data
        const fallbackData = await simulateApiCall(mockSystemAdminSystemUsersData);
        setUsers(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userRole, clinicId]);

  /**
   * Render individual user item
   */
  const renderUserItem = (user, index) => (
    <ListItem key={user.id || index}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 1 }}>
          {`${user.firstName || user.name || 'Unknown'} ${user.lastName || ''}`}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Box sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
            {user.roles
              ? user.roles.map(role => roleMapping[role] || role).join(', ')
              : user.role || 'No role assigned'
            } | {user.email}
          </Box>
          {user.clinicName && (
            <Box sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
              Clinic: {user.clinicName}
            </Box>
          )}
          <Chip
            label={user.enabled !== undefined ? (user.enabled ? 'Enabled' : 'Disabled') : 'Active'}
            color={user.enabled !== undefined ? (user.enabled ? 'success' : 'error') : 'success'}
            size="small"
          />
        </Box>
      </Box>
    </ListItem>
  );

  /**
   * Get role-specific button text
   */
  const getAddButtonText = () => {
    switch (userRole) {
      case 'SYSTEM_ADMIN':
        return 'Add New User';
      case 'CLINIC_ADMIN':
        return 'Add New Staff';
      default:
        return 'Add User';
    }
  };

  /**
   * Get role-specific empty message
   */
  const getEmptyMessage = () => {
    switch (userRole) {
      case 'SYSTEM_ADMIN':
        return 'No system users found.';
      case 'CLINIC_ADMIN':
        return 'No staff members found.';
      default:
        return 'No users found.';
    }
  };

  if (loading) {
    return <Alert severity="info">Loading users...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <ActionButton variant="contained" color="primary" position="left">
        {getAddButtonText()}
      </ActionButton>
      <ListCard
        items={users}
        renderItem={renderUserItem}
        emptyMessage={getEmptyMessage()}
      />
    </Box>
  );
};

UserManagementPage.propTypes = {
  /** User role to determine view type */
  userRole: PropTypes.oneOf(['SYSTEM_ADMIN', 'CLINIC_ADMIN']),
  /** Clinic ID for filtering staff (Clinic Admin only) */
  clinicId: PropTypes.string,
};

export default UserManagementPage;
