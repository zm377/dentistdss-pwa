import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useAuth } from '../../../context/auth';
import { MessageSection } from '../../../components/Dashboard/shared';

/**
 * MessagesPage - Unified messages page for all roles
 * 
 * Features:
 * - Role-agnostic message center
 * - Reuses existing MessageSection component
 */
const MessagesPage = () => {
  const { currentUser } = useAuth() || {};
  const userId = currentUser?.uid || currentUser?.id || 'defaultUser';

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <MessageSection userId={userId} />
    </Box>
  );
};

MessagesPage.propTypes = {
  // No additional props needed - uses current user context
};

export default MessagesPage;
