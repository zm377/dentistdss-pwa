import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

/**
 * CommunicationsPage - Communications tools page for receptionists
 * 
 * Features:
 * - Appointment reminders
 * - SMS notifications
 * - Communication tools
 */
const CommunicationsPage = () => {
  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Communication Tools
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Appointment Reminders"
                secondary="Send automated reminders to patients"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="SMS Notifications"
                secondary="Log and manage text message notifications sent to patients"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

CommunicationsPage.propTypes = {
  // No additional props needed
};

export default CommunicationsPage;
