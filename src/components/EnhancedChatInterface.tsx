import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  ContentCopy as ContentCopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/auth';
import api from '../services';


interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
}

interface EnhancedChatInterfaceProps {
  chatType?: 'help' | 'aidentist' | 'general';
  placeholder?: string;
  welcomeMessage?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  chatType = 'help',
  placeholder = "Ask me anything about dental health...",
  welcomeMessage = "Hello! I'm your AI dental assistant. How can I help you today?"
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      // Create AI message placeholder
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Determine which API endpoint to use based on chatType
      let apiCall: Promise<any>;
      switch (chatType) {
        case 'aidentist':
          apiCall = api.chatbot.aidentist(userMessage.content, (token: string, fullText: string) => {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessage.id
                  ? { ...msg, content: fullText }
                  : msg
              )
            );
          });
          break;
        case 'help':
        default:
          apiCall = api.chatbot.help(userMessage.content, (token: string, fullText: string) => {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessage.id
                  ? { ...msg, content: fullText }
                  : msg
              )
            );
          });
          break;
      }

      // Wait for the complete response
      await apiCall;

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleRegenerateResponse = (messageId: number): void => {
    // Find the user message that prompted this AI response
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.type === 'user') {
        // Remove the AI message and regenerate
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        // Simulate sending the user message again
        setTimeout(() => {
          handleSendMessage();
        }, 100);
      }
    }
  };

  const handleCopyMessage = (content: string): void => {
    navigator.clipboard.writeText(content);
    // Could add a snackbar notification here
  };

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.type === 'user';
    const isAI = message.type === 'ai';

    return (
      <Fade in timeout={300}>
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isUser ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              maxWidth: '80%',
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: isUser ? 'primary.main' : 'secondary.main',
                width: 32,
                height: 32,
              }}
            >
              {isUser ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>

            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: isUser ? 'primary.main' : 'background.paper',
                color: isUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              {isAI ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <Typography variant="body1">{message.content}</Typography>
              )}

              {message.isStreaming && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    AI is typing...
                  </Typography>
                </Box>
              )}

              {message.isError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Failed to get response
                </Alert>
              )}

              {/* Message actions for AI messages */}
              {isAI && !message.isStreaming && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Copy message">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyMessage(message.content)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Regenerate response">
                    <IconButton
                      size="small"
                      onClick={() => handleRegenerateResponse(message.id)}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Helpful">
                    <IconButton size="small">
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Not helpful">
                    <IconButton size="small">
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  opacity: 0.7,
                  fontSize: '0.75rem',
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Paper>
          </Box>
        </ListItem>
      </Fade>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" />
          <Typography variant="h6">
            {chatType === 'aidentist' ? 'AI Dentist' : 'Dental Assistant'}
          </Typography>
          <Chip
            label="Online"
            color="success"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{ mb: 0.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>

        {/* Quick action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setInputValue('I have tooth pain')}
            disabled={isLoading}
          >
            Tooth Pain
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setInputValue('Book an appointment')}
            disabled={isLoading}
          >
            Book Appointment
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setInputValue('Dental cleaning info')}
            disabled={isLoading}
          >
            Cleaning Info
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EnhancedChatInterface;
