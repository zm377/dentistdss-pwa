import React, {useState, useEffect, createContext, useContext, useCallback} from 'react';
import {
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Avatar,
  Switch,
  FormControlLabel,
  Collapse,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Close as CloseIcon,
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  FilterList as FilterListIcon,
  Schedule as ScheduleIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  MailOutline as MailOutlineIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({children}) => {
  const [notifications, setNotifications] = useState([]);
  const [snackbars, setSnackbars] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    sms: false,
    types: {
      appointment: true,
      medical: true,
      patient: true,
      system: true,
      payment: true,
      security: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const isQuietHours = useCallback(() => {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = parseInt(settings.quietHours.start.split(':')[0]) * 60 +
        parseInt(settings.quietHours.start.split(':')[1]);
    const endTime = parseInt(settings.quietHours.end.split(':')[0]) * 60 +
        parseInt(settings.quietHours.end.split(':')[1]);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }, [settings.quietHours]);

  const playNotificationSound = useCallback(() => {
    if (settings.sound && !isQuietHours()) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, [settings.sound, isQuietHours]);

  const requestDesktopPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const showDesktopNotification = useCallback((notification) => {
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: notification.id,
        requireInteraction: notification.urgent,
      });

      desktopNotification.onclick = () => {
        window.focus();
        desktopNotification.close();
      };

      setTimeout(() => {
        desktopNotification.close();
      }, 5000);
    }
  }, [settings.desktop]);

  const addNotification = useCallback((notification) => {
    // Check if notifications are enabled and type is allowed
    if (!settings.enabled || !settings.types[notification.type]) {
      return;
    }

    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      category: 'general',
      priority: 'normal',
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled
    playNotificationSound();

    // Show desktop notification if enabled
    if (!isQuietHours()) {
      showDesktopNotification(newNotification);
    }

    // Show as snackbar if urgent or high priority
    if (notification.urgent || notification.priority === 'high') {
      addSnackbar({
        message: notification.title,
        severity: notification.type === 'error' ? 'error' :
            notification.type === 'warning' ? 'warning' :
                notification.type === 'success' ? 'success' : 'info',
        autoHideDuration: notification.urgent ? 8000 : 6000,
      });
    }
  }, [settings, playNotificationSound, showDesktopNotification, isQuietHours]);

  const addSnackbar = useCallback((snackbar) => {
    const newSnackbar = {
      id: Date.now() + Math.random(),
      autoHideDuration: 4000,
      ...snackbar,
    };
    setSnackbars(prev => [...prev, newSnackbar]);
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
        prev.map(notification =>
            notification.id === id ? {...notification, read: true} : notification
        )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
        prev.map(notification => ({...notification, read: true}))
    );
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({...prev, ...newSettings}));
  }, []);

  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => !n.read && n.urgent).length;

  const value = {
    notifications,
    snackbars,
    unreadCount,
    urgentCount,
    settings,
    addNotification,
    addSnackbar,
    removeSnackbar,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationsByCategory,
    getNotificationsByType,
    requestDesktopPermission,
  };

  return (
      <NotificationContext.Provider value={value}>
        {children}
        <SnackbarContainer/>
      </NotificationContext.Provider>
  );
};

// Snackbar Container Component
const SnackbarContainer = () => {
  const {snackbars, removeSnackbar} = useNotifications();

  return (
      <>
        {snackbars.map((snackbar, index) => (
            <Snackbar
                key={snackbar.id}
                open={true}
                autoHideDuration={snackbar.autoHideDuration}
                onClose={() => removeSnackbar(snackbar.id)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                sx={{
                  bottom: {xs: 90 + (index * 70), sm: 24 + (index * 70)},
                  zIndex: 1400 + index,
                }}
            >
              <Alert
                  severity={snackbar.severity}
                  onClose={() => removeSnackbar(snackbar.id)}
                  variant="filled"
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
        ))}
      </>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const {notifications, unreadCount, urgentCount, settings} = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
              {settings.enabled ? <NotificationsIcon/> : <NotificationsOffIcon/>}
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

// Notification Drawer Component
const NotificationDrawer = ({open, onClose, notifications}) => {
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    settings,
    updateSettings,
    requestDesktopPermission
  } = useNotifications();

  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <EventIcon/>;
      case 'medical':
        return <MedicalServicesIcon/>;
      case 'patient':
        return <PersonIcon/>;
      case 'system':
        return <SettingsIcon/>;
      case 'payment':
        return <PaymentIcon/>;
      case 'security':
        return <SecurityIcon/>;
      case 'warning':
        return <WarningIcon/>;
      case 'error':
        return <ErrorIcon/>;
      case 'success':
        return <CheckCircleIcon/>;
      default:
        return <InfoIcon/>;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'primary';
      case 'medical':
        return 'secondary';
      case 'patient':
        return 'info';
      case 'system':
        return 'default';
      case 'payment':
        return 'success';
      case 'security':
        return 'error';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.read;
    if (filterType === 'urgent') return notification.urgent;
    return notification.type === filterType;
  });

  const handleSettingsChange = (key, value) => {
    updateSettings({[key]: value});
  };

  const handleTypeSettingChange = (type, enabled) => {
    updateSettings({
      types: {
        ...settings.types,
        [type]: enabled
      }
    });
  };

  const handleQuietHoursChange = (key, value) => {
    updateSettings({
      quietHours: {
        ...settings.quietHours,
        [key]: value
      }
    });
  };

  const renderNotificationsList = () => (
      <Box sx={{flex: 1, overflow: 'auto'}}>
        {/* Filter Controls */}
        <Box sx={{p: 2, borderBottom: '1px solid', borderColor: 'divider'}}>
          <FormControl size="small" sx={{minWidth: 120}}>
            <InputLabel>Filter</InputLabel>
            <Select
                value={filterType}
                label="Filter"
                onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="appointment">Appointments</MenuItem>
              <MenuItem value="medical">Medical</MenuItem>
              <MenuItem value="patient">Patients</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredNotifications.length === 0 ? (
            <Box sx={{textAlign: 'center', py: 4}}>
              <NotificationsIcon sx={{fontSize: 48, color: 'text.secondary', mb: 2}}/>
              <Typography variant="body1" color="text.secondary">
                {filterType === 'all' ? 'No notifications yet' : `No ${filterType} notifications`}
              </Typography>
            </Box>
        ) : (
            <List sx={{p: 0}}>
              {filteredNotifications.map((notification, index) => (
                  <Fade in timeout={300} key={notification.id}>
                    <ListItem
                        sx={{
                          bgcolor: notification.read ? 'transparent' : 'action.hover',
                          borderLeft: notification.urgent ? '4px solid' : 'none',
                          borderColor: 'error.main',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.selected',
                          },
                        }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <ListItemIcon>
                        <Avatar
                            sx={{
                              bgcolor: `${getNotificationColor(notification.type)}.main`,
                              width: 32,
                              height: 32,
                            }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemIcon>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                          <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notification.read ? 'normal' : 'bold',
                                flexGrow: 1,
                              }}
                          >
                            {notification.title}
                          </Typography>
                          {notification.urgent && (
                              <Chip label="Urgent" color="error" size="small"/>
                          )}
                          {notification.priority === 'high' && !notification.urgent && (
                              <Chip label="High" color="warning" size="small"/>
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                        </Box>
                      </Box>

                      <ListItemSecondaryAction>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                        >
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Fade>
              ))}
            </List>
        )}
      </Box>
  );

  const renderSettingsPanel = () => (
      <Box sx={{p: 2}}>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>

        {/* General Settings */}
        <Card sx={{mb: 2}}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              General
            </Typography>

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.enabled}
                      onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                  />
                }
                label="Enable notifications"
            />

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.sound}
                      onChange={(e) => handleSettingsChange('sound', e.target.checked)}
                      disabled={!settings.enabled}
                  />
                }
                label={
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {settings.sound ? <VolumeUpIcon/> : <VolumeOffIcon/>}
                    Sound alerts
                  </Box>
                }
            />

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.desktop}
                      onChange={(e) => {
                        handleSettingsChange('desktop', e.target.checked);
                        if (e.target.checked) {
                          requestDesktopPermission();
                        }
                      }}
                      disabled={!settings.enabled}
                  />
                }
                label="Desktop notifications"
            />

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.email}
                      onChange={(e) => handleSettingsChange('email', e.target.checked)}
                      disabled={!settings.enabled}
                  />
                }
                label={
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <MailOutlineIcon/>
                    Email notifications
                  </Box>
                }
            />

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.sms}
                      onChange={(e) => handleSettingsChange('sms', e.target.checked)}
                      disabled={!settings.enabled}
                  />
                }
                label={
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <SmsIcon/>
                    SMS notifications
                  </Box>
                }
            />
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card sx={{mb: 2}}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Notification Types
            </Typography>

            {Object.entries(settings.types).map(([type, enabled]) => (
                <FormControlLabel
                    key={type}
                    control={
                      <Switch
                          checked={enabled}
                          onChange={(e) => handleTypeSettingChange(type, e.target.checked)}
                          disabled={!settings.enabled}
                      />
                    }
                    label={
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {getNotificationIcon(type)}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Box>
                    }
                />
            ))}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Quiet Hours
            </Typography>

            <FormControlLabel
                control={
                  <Switch
                      checked={settings.quietHours.enabled}
                      onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                      disabled={!settings.enabled}
                  />
                }
                label="Enable quiet hours"
            />

            {settings.quietHours.enabled && (
                <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                  <TextField
                      label="Start time"
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      size="small"
                      InputLabelProps={{shrink: true}}
                  />
                  <TextField
                      label="End time"
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      size="small"
                      InputLabelProps={{shrink: true}}
                  />
                </Box>
            )}
          </CardContent>
        </Card>
      </Box>
  );

  return (
      <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {width: {xs: '100%', sm: 400}, display: 'flex', flexDirection: 'column'}
          }}
      >
        {/* Header */}
        <Box sx={{p: 2, borderBottom: '1px solid', borderColor: 'divider'}}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant="h6">
              Notifications
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Tooltip title="Settings">
                <IconButton
                    onClick={() => setShowSettings(!showSettings)}
                    color={showSettings ? 'primary' : 'default'}
                >
                  <SettingsIcon/>
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose}>
                <CloseIcon/>
              </IconButton>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{mt: 1}}
          >
            <Tab label="All"/>
            <Tab label="Unread"/>
            <Tab label="Urgent"/>
          </Tabs>

          {/* Action Buttons */}
          {!showSettings && notifications.length > 0 && (
              <Box sx={{display: 'flex', gap: 1, mt: 2}}>
                <Button
                    size="small"
                    startIcon={<MarkEmailReadIcon/>}
                    onClick={markAllAsRead}
                    variant="outlined"
                >
                  Mark all read
                </Button>
                <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon/>}
                    onClick={clearAllNotifications}
                    variant="outlined"
                >
                  Clear all
                </Button>
              </Box>
          )}
        </Box>

        {/* Content */}
        {showSettings ? renderSettingsPanel() : renderNotificationsList()}
      </Drawer>
  );
};

// Hook for simulating real-time notifications (for demo purposes)
export const useRealtimeNotifications = (userRole = 'patient') => {
  const {addNotification} = useNotifications();

  useEffect(() => {
    // Different notification types based on user role
    const getNotificationTypes = () => {
      const baseTypes = [
        {
          type: 'system',
          title: 'System Update',
          message: 'The system will undergo maintenance tonight from 2-4 AM',
          priority: 'normal',
        },
      ];

      if (userRole === 'patient') {
        return [
          ...baseTypes,
          {
            type: 'appointment',
            title: 'Appointment Reminder',
            message: 'You have an appointment tomorrow at 2:00 PM with Dr. Smith',
            priority: 'high',
          },
          {
            type: 'medical',
            title: 'Lab Results Ready',
            message: 'Your recent lab results are now available for review',
            priority: 'normal',
          },
          {
            type: 'payment',
            title: 'Payment Due',
            message: 'Your payment for the last appointment is due in 3 days',
            priority: 'normal',
          },
        ];
      }

      if (userRole === 'dentist') {
        return [
          ...baseTypes,
          {
            type: 'patient',
            title: 'New Patient Registration',
            message: 'A new patient has registered and needs approval',
            urgent: true,
            priority: 'high',
          },
          {
            type: 'appointment',
            title: 'Schedule Change',
            message: 'Patient John Doe has requested to reschedule their appointment',
            priority: 'normal',
          },
          {
            type: 'medical',
            title: 'Lab Results Alert',
            message: 'Urgent lab results require immediate attention for Patient #1234',
            urgent: true,
            priority: 'high',
          },
        ];
      }

      if (userRole === 'receptionist') {
        return [
          ...baseTypes,
          {
            type: 'appointment',
            title: 'Appointment Request',
            message: 'New appointment request from Jane Wilson for next week',
            priority: 'normal',
          },
          {
            type: 'patient',
            title: 'Patient Check-in',
            message: 'Mike Johnson has checked in for his 2:00 PM appointment',
            priority: 'normal',
          },
          {
            type: 'payment',
            title: 'Payment Received',
            message: 'Payment of $150 received from Sarah Davis',
            priority: 'normal',
          },
        ];
      }

      return baseTypes;
    };

    // Simulate receiving notifications
    const interval = setInterval(() => {
      const notificationTypes = getNotificationTypes();

      // Randomly send a notification (15% chance every 45 seconds)
      if (Math.random() < 0.15) {
        const randomNotification = notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
            ];
        addNotification({
          ...randomNotification,
          category: userRole,
        });
      }
    }, 45000); // Check every 45 seconds

    return () => clearInterval(interval);
  }, [addNotification, userRole]);
};

// Notification Toast Component for quick messages
export const NotificationToast = ({
                                    message,
                                    severity = 'info',
                                    duration = 4000,
                                    onClose
                                  }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) onClose();
  };

  return (
      <Snackbar
          open={open}
          autoHideDuration={duration}
          onClose={handleClose}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
  );
};

// Notification Badge Component
export const NotificationBadge = ({children, count = 0, showZero = false}) => {
  return (
      <Badge
          badgeContent={count}
          color="error"
          invisible={!showZero && count === 0}
          max={99}
      >
        {children}
      </Badge>
  );
};

// Notification Status Indicator
export const NotificationStatusIndicator = () => {
  const {settings, unreadCount, urgentCount} = useNotifications();

  if (!settings.enabled) {
    return (
        <Tooltip title="Notifications disabled">
          <Chip
              icon={<NotificationsOffIcon/>}
              label="Notifications Off"
              size="small"
              color="default"
              variant="outlined"
          />
        </Tooltip>
    );
  }

  if (urgentCount > 0) {
    return (
        <Tooltip title={`${urgentCount} urgent notifications`}>
          <Chip
              icon={<WarningIcon/>}
              label={`${urgentCount} Urgent`}
              size="small"
              color="error"
              sx={{animation: 'pulse 2s infinite'}}
          />
        </Tooltip>
    );
  }

  if (unreadCount > 0) {
    return (
        <Tooltip title={`${unreadCount} unread notifications`}>
          <Chip
              icon={<NotificationsIcon/>}
              label={unreadCount}
              size="small"
              color="primary"
          />
        </Tooltip>
    );
  }

  return (
      <Tooltip title="All notifications read">
        <Chip
            icon={<CheckCircleIcon/>}
            label="All Read"
            size="small"
            color="success"
            variant="outlined"
        />
      </Tooltip>
  );
};

// Utility function to create notifications
export const createNotification = (type, title, message, options = {}) => {
  return {
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
    urgent: false,
    priority: 'normal',
    category: 'general',
    ...options,
  };
};

// Predefined notification templates
export const NotificationTemplates = {
  appointmentReminder: (patientName, date, time) => createNotification(
      'appointment',
      'Appointment Reminder',
      `Reminder: ${patientName} has an appointment on ${date} at ${time}`,
      {priority: 'high'}
  ),

  appointmentCancelled: (patientName, date) => createNotification(
      'appointment',
      'Appointment Cancelled',
      `${patientName}'s appointment on ${date} has been cancelled`,
      {priority: 'normal'}
  ),

  labResultsReady: (patientName) => createNotification(
      'medical',
      'Lab Results Ready',
      `Lab results are ready for ${patientName}`,
      {priority: 'normal'}
  ),

  urgentLabResults: (patientName) => createNotification(
      'medical',
      'Urgent Lab Results',
      `URGENT: Lab results for ${patientName} require immediate attention`,
      {urgent: true, priority: 'high'}
  ),

  paymentReceived: (amount, patientName) => createNotification(
      'payment',
      'Payment Received',
      `Payment of $${amount} received from ${patientName}`,
      {priority: 'normal'}
  ),

  paymentOverdue: (amount, patientName) => createNotification(
      'payment',
      'Payment Overdue',
      `Payment of $${amount} from ${patientName} is overdue`,
      {priority: 'high'}
  ),

  newPatientRegistration: (patientName) => createNotification(
      'patient',
      'New Patient Registration',
      `${patientName} has registered as a new patient`,
      {priority: 'normal'}
  ),

  systemMaintenance: (startTime, endTime) => createNotification(
      'system',
      'Scheduled Maintenance',
      `System maintenance scheduled from ${startTime} to ${endTime}`,
      {priority: 'normal'}
  ),

  securityAlert: (message) => createNotification(
      'security',
      'Security Alert',
      message,
      {urgent: true, priority: 'high'}
  ),
};

export default NotificationProvider;
