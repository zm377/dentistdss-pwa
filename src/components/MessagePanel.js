import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Badge,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
  ListItemIcon
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts'; // For read messages
import SortIcon from '@mui/icons-material/Sort'; // Placeholder for sorting options

// Mock data - replace with API calls
const mockUserMessages = [
  {
    id: 'msg1',
    subject: 'Welcome to Dentabot!',
    content: 'We are excited to have you on board. Explore our features and let us know if you have questions.',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    sender: 'System Admin'
  },
  {
    id: 'msg2',
    subject: 'Your recent inquiry about teeth whitening',
    content: 'Please find attached information regarding teeth whitening options available at our clinic...',
    date: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    sender: 'Sunshine Dental Clinic'
  },
  {
    id: 'msg3',
    subject: 'Upcoming Appointment Reminder',
    content: 'This is a reminder for your appointment on July 30th at 10:00 AM.',
    date: new Date().toISOString(),
    read: false,
    sender: 'Bright Smiles Dental Care'
  },
  {
    id: 'msg4',
    subject: 'Password Reset Confirmation',
    content: 'Your password has been successfully reset. If you did not request this, please contact support immediately.',
    date: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    sender: 'Security Team'
  },
];

const MessagePanel = ({userId}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_asc', 'read_status'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API call to fetch messages for the userId
    setTimeout(() => {
      // In a real app, filter messages based on userId or fetch specific to user
      setMessages(mockUserMessages);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      // Mark as read locally and then call API
      setMessages(prevMessages =>
          prevMessages.map(m => m.id === message.id ? {...m, read: true} : m)
      );
      // TODO: API call to mark message as read
      console.log(`Marking message ${message.id} as read`);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    if (sortBy === 'read_status') {
      return a.read === b.read ? 0 : a.read ? 1 : -1; // Unread first
    }
    // Default to date descending
    return new Date(b.date) - new Date(a.date);
  });

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}><CircularProgress/></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{m: 2}}>{error}</Alert>;
  }

  return (
      <Paper elevation={3}
             sx={{p: isMobile ? 1 : 2, mt: 2, maxHeight: '70vh', display: 'flex', flexDirection: 'column'}}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant={isMobile ? "h6" : "h5"} component="h2">
            My Messages
          </Typography>
          <Tooltip title={`You have ${unreadCount} unread messages`}>
            <Badge badgeContent={unreadCount} color="error">
              <MailIcon/>
            </Badge>
          </Tooltip>
          {/* TODO: Add sorting options UI */}
        </Box>

        {messages.length === 0 ? (
            <Typography sx={{textAlign: 'center', p: 2}}>You have no messages.</Typography>
        ) : (
            <Grid container spacing={isMobile ? 1 : 2} sx={{flexGrow: 1, overflow: 'hidden'}}>
              <Grid item xs={12} md={4} sx={{
                overflowY: 'auto',
                height: isMobile ? '200px' : 'auto',
                borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
                p: 1
              }}>
                <List component="nav" aria-label="message list">
                  {sortedMessages.map((msg) => (
                      <React.Fragment key={msg.id}>
                        <ListItem
                            button
                            selected={selectedMessage?.id === msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            sx={{
                              bgcolor: selectedMessage?.id === msg.id ? theme.palette.action.selected : 'inherit',
                              borderRadius: 1,
                              mb: 0.5
                            }}
                        >
                          <ListItemIcon sx={{minWidth: 'auto', mr: 1.5}}>
                            {msg.read ? <DraftsIcon color="disabled"/> : <MailIcon color="primary"/>}
                          </ListItemIcon>
                          <ListItemText
                              primary={msg.subject}
                              secondary={`From: ${msg.sender} - ${new Date(msg.date).toLocaleDateString()}`}
                              primaryTypographyProps={{fontWeight: msg.read ? 'normal' : 'bold', noWrap: true}}
                              secondaryTypographyProps={{noWrap: true}}
                          />
                          {!msg.read && <Chip label="New" color="primary" size="small" sx={{ml: 1}}/>}
                        </ListItem>
                        <Divider component="li"/>
                      </React.Fragment>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={8}
                    sx={{overflowY: 'auto', height: isMobile ? 'calc(100% - 200px)' : 'auto', p: isMobile ? 1 : 2}}>
                {selectedMessage ? (
                    <Box>
                      <Typography variant="h6" gutterBottom>{selectedMessage.subject}</Typography>
                      <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                        From: {selectedMessage.sender} | Received: {new Date(selectedMessage.date).toLocaleString()}
                      </Typography>
                      <Divider sx={{my: 2}}/>
                      <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{selectedMessage.content}</Typography>
                    </Box>
                ) : (
                    <Typography sx={{textAlign: 'center', color: 'text.secondary', mt: isMobile ? 2 : 4}}>
                      Select a message to read its content.
                    </Typography>
                )}
              </Grid>
            </Grid>
        )}
      </Paper>
  );
};

export default MessagePanel;