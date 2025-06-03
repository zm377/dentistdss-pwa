import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  ListItem,
  ListItemAvatar,
  CircularProgress,
} from '@mui/material';

/**
 * Reusable chat message component
 */
const ChatMessage = ({ 
  message, 
  userAvatar, 
  aiAvatar, 
  currentUser,
  isStreaming = false 
}) => {
  const isUser = message.type === 'user';
  
  return (
    <ListItem
      sx={{
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 1,
      }}
    >
      <ListItemAvatar sx={{ 
        minWidth: 48,
        ml: isUser ? 1 : 0,
        mr: isUser ? 0 : 1,
      }}>
        <Avatar sx={{ 
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          width: 32,
          height: 32,
        }}>
          {isUser ? 
            (userAvatar || currentUser?.firstName?.charAt(0) || 'U') : 
            aiAvatar
          }
        </Avatar>
      </ListItemAvatar>
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.light' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
          {(message.isStreaming || isStreaming) && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
              <CircularProgress size={16} />
            </Box>
          )}
        </Typography>
        <Typography variant="caption" sx={{ 
          opacity: 0.7,
          display: 'block',
          mt: 0.5,
        }}>
          {message.timestamp.toLocaleTimeString()}
        </Typography>
      </Paper>
    </ListItem>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['user', 'ai']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    isStreaming: PropTypes.bool,
  }).isRequired,
  userAvatar: PropTypes.node,
  aiAvatar: PropTypes.node.isRequired,
  currentUser: PropTypes.object,
  isStreaming: PropTypes.bool,
};

export default ChatMessage;
