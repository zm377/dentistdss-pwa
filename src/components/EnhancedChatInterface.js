import React, {useState, useRef, useEffect} from 'react';
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
import {useAuth} from '../context/AuthContext';

const EnhancedChatInterface = ({
                                 chatType = 'help', // 'help', 'aidentist', 'general'
                                 placeholder = "Ask me anything about dental health...",
                                 welcomeMessage = "Hello! I'm your AI dental assistant. How can I help you today?"
                               }) => {
  const {currentUser} = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
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
      // Simulate AI response with streaming effect
      const aiResponse = await simulateAIResponse(userMessage.content, chatType);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Simulate streaming by adding characters gradually
      let currentContent = '';
      for (let i = 0; i < aiResponse.length; i++) {
        currentContent += aiResponse[i];
        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessage.id
                    ? {...msg, content: currentContent}
                    : msg
            )
        );
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Mark streaming as complete
      setMessages(prev =>
          prev.map(msg =>
              msg.id === aiMessage.id
                  ? {...msg, isStreaming: false}
                  : msg
          )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
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

  const simulateAIResponse = async (userInput, type) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      help: {
        'appointment': 'To book an appointment, you can use our online booking system or call our clinic directly. Our available time slots are updated in real-time to ensure accuracy.',
        'pain': 'Dental pain can have various causes. For immediate relief, you can try over-the-counter pain medication and cold compress. However, I strongly recommend scheduling an appointment as soon as possible for proper diagnosis.',
        'cleaning': 'Regular dental cleanings are recommended every 6 months. They help prevent cavities, gum disease, and maintain overall oral health.',
        'default': 'Thank you for your question! I\'m here to help with dental health information, appointment booking, and general clinic inquiries. Could you please provide more specific details about what you\'d like to know?'
      },
      aidentist: {
        'symptoms': 'Based on the symptoms you\'ve described, I recommend scheduling an appointment for a thorough examination. In the meantime, maintain good oral hygiene and avoid very hot or cold foods.',
        'treatment': 'Treatment options vary depending on the specific condition. I\'d need to perform a clinical examination to provide accurate recommendations. Would you like to schedule a consultation?',
        'default': 'As your AI dental assistant, I can help with preliminary assessments and treatment planning. Please describe your symptoms or concerns in detail.'
      }
    };

    const typeResponses = responses[type] || responses.help;

    // Simple keyword matching for demo
    const keywords = Object.keys(typeResponses);
    const matchedKeyword = keywords.find(keyword =>
        userInput.toLowerCase().includes(keyword)
    );

    return typeResponses[matchedKeyword] || typeResponses.default;
  };

  const handleRegenerateResponse = (messageId) => {
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

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Could add a snackbar notification here
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({message}) => {
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
                {isUser ? <PersonIcon/> : <SmartToyIcon/>}
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
                    <Box sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                      <CircularProgress size={16}/>
                      <Typography variant="caption" sx={{ml: 1}}>
                        AI is typing...
                      </Typography>
                    </Box>
                )}

                {message.isError && (
                    <Alert severity="error" sx={{mt: 1}}>
                      Failed to get response
                    </Alert>
                )}

                {/* Message actions for AI messages */}
                {isAI && !message.isStreaming && (
                    <Box sx={{display: 'flex', gap: 0.5, mt: 1, justifyContent: 'flex-end'}}>
                      <Tooltip title="Copy message">
                        <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message.content)}
                        >
                          <ContentCopyIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Regenerate response">
                        <IconButton
                            size="small"
                            onClick={() => handleRegenerateResponse(message.id)}
                        >
                          <RefreshIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Helpful">
                        <IconButton size="small">
                          <ThumbUpIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Not helpful">
                        <IconButton size="small">
                          <ThumbDownIcon fontSize="small"/>
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
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <SmartToyIcon color="primary"/>
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
          <List sx={{p: 0}}>
            {messages.map((message) => (
                <MessageBubble key={message.id} message={message}/>
            ))}
          </List>
          <div ref={messagesEndRef}/>
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
          <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-end'}}>
            <TextField
                ref={inputRef}
                fullWidth
                multiline
                maxRows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
                sx={{mb: 0.5}}
            >
              {isLoading ? <CircularProgress size={24}/> : <SendIcon/>}
            </IconButton>
          </Box>

          {/* Quick action buttons */}
          <Box sx={{display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap'}}>
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
