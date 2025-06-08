import React, { useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
} from '@mui/icons-material';
import { useNotifications } from './NotificationContext';
import { NotificationDrawer } from './NotificationDrawer';

/**
 * Notification Bell Component
 * Displays notification count and opens drawer when clicked
 */
export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, urgentCount, settings } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <Tooltip title={`${unreadCount} unread notifications${urgentCount > 0 ? ` (${urgentCount} urgent)` : ''}`}>
        <IconButton
          color="inherit"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'relative',
            '&::after': urgentCount > 0 ? {
              content: '""',
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'error.main',
              animation: 'pulse 2s infinite',
            } : {},
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
          >
            {settings.enabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
      />
    </>
  );
};
