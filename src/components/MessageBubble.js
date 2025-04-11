import React from 'react';
import { Box, Typography, Paper, IconButton, Avatar, Fade } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const MessageBubble = ({ message, showThinking, onToggleThinking, isThinkingClosing }) => {
  const isUser = message.role === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        position: 'relative',
      }}
    >
      {!isUser && (
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            mr: 1,
            width: 36, 
            height: 36 
          }}
        >
          <SmartToyIcon fontSize="small" />
        </Avatar>
      )}
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.light' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
        }}
      >
        {message.thinking && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton 
                size="small" 
                onClick={onToggleThinking}
                sx={{ mr: 1 }}
              >
                <PsychologyIcon fontSize="small" color={showThinking ? "primary" : "action"} />
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {showThinking ? "Hide Thinking Process" : "Show Thinking Process"}
              </Typography>
            </Box>
            
            {showThinking && (
              <Fade in={!isThinkingClosing} timeout={1000}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default', 
                    borderRadius: 1,
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <Box sx={{ display: 'inline' }}>
                    {message.thinking.replace(/^<think>/, '')}
                    {message.isStreaming && (
                      <span className="typing-indicator" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                    )}
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
        )}

        <ReactMarkdown>{message.content}</ReactMarkdown>
      </Paper>
      
      {isUser && (
        <Avatar 
          sx={{ 
            bgcolor: 'secondary.main', 
            ml: 1,
            width: 36, 
            height: 36 
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;