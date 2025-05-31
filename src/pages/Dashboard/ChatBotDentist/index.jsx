import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  Box,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../../../services';
import MessageBubble from '../../../components/MessageBubble';

const INITIAL_MESSAGE = {
  role: 'Professional Dentist',
  content: "Hello! I'm your professional dentist AI. How can I help you with your dental questions today?"
};

const THINKING_ANIMATION_DURATION = 1000;
const DOTS_INTERVAL = 500;
const THINK_TAG_START = '<think>';
const THINK_TAG_END = '</think>';

const ChatInterface = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [dots, setDots] = useState('');
  const [isThinkingClosing, setIsThinkingClosing] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [isAtBottom]);

  const handleScroll = useCallback(() => {
    if (messageContainerRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = messageContainerRef.current;
      // Consider the user at bottom if they're within 30px of the bottom
      const bottomThreshold = 30;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight <= bottomThreshold);
    }
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    let dotsInterval;
    const isStreaming = messages[messages.length - 1]?.isStreaming;

    if (isStreaming) {
      dotsInterval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, DOTS_INTERVAL);
    } else {
      setDots('');
    }

    return () => clearInterval(dotsInterval);
  }, [messages]);

  useEffect(() => {
    if (isThinkingClosing) {
      const timer = setTimeout(() => {
        setShowThinking(false);
        setIsThinkingClosing(false);
      }, THINKING_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isThinkingClosing]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, showThinking, scrollToBottom]);

  const processThinkingContent = useCallback((fullText, updatedMessages) => {
    const thinkMatch = fullText.match(new RegExp(`${THINK_TAG_START}(.*?)`, 's'));
    if (!thinkMatch) {
      return {
        updatedMessages: [
          ...updatedMessages.slice(0, -1),
          {role: 'assistant', content: fullText, isStreaming: true}
        ],
        shouldShowThinking: false
      };
    }

    setShowThinking(true);
    const thinkingStartIndex = fullText.indexOf(THINK_TAG_START) + THINK_TAG_START.length;
    const thinkingText = fullText.substring(thinkingStartIndex);
    const thinkingEndIndex = thinkingText.indexOf(THINK_TAG_END);

    if (thinkingEndIndex === -1) {
      setThinking(thinkingText);
      return {
        updatedMessages: [
          ...updatedMessages.slice(0, -1),
          {
            role: 'assistant',
            content: fullText.substring(0, fullText.indexOf(THINK_TAG_START)).trim(),
            thinking: thinkingText,
            isStreaming: true
          }
        ],
        shouldShowThinking: true
      };
    }

    const completeThinkingText = thinkingText.substring(0, thinkingEndIndex);
    const finalContent = fullText.replace(new RegExp(`${THINK_TAG_START}.*?${THINK_TAG_END}`, 's'), '').trim();
    setThinking(completeThinkingText);

    return {
      updatedMessages: [
        ...updatedMessages.slice(0, -1),
        {
          role: 'assistant',
          content: finalContent,
          thinking: completeThinkingText,
          isStreaming: false
        }
      ],
      shouldShowThinking: false
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {role: 'user', content: input};
    setMessages(prev => [...prev, userMessage, {role: 'assistant', content: '', thinking: null, isStreaming: true}]);
    setInput('');
    setThinking('');
    setShowThinking(true);
    setIsThinkingClosing(false);

    try {
      await api.chatbot.botDentist(
          messages,
          input,
          (token, fullText) => {
            setMessages(prevMessages => {
              const {updatedMessages} = processThinkingContent(fullText, prevMessages);

              return updatedMessages;
            });
          }
      );
    } catch (error) {
      console.error('Error calling ChatBot:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again later.",
          isStreaming: false
        }
      ]);
      setShowThinking(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleThinking = useCallback(() => {
    setIsThinkingClosing(showThinking);
    setShowThinking(!showThinking);
  }, [showThinking]);

  const paperStyles = useMemo(() => ({
    flexGrow: 1,
    mb: 2,
    p: isMobile ? 1 : 2,
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: isMobile ? 1 : 2
  }), [isMobile]);

  const isLastMessage = useCallback((index) => index === messages.length - 1, [messages.length]);

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 'calc(100vh - 120px)' : '70vh',
        maxWidth: '100%'
      }}>
        <Paper elevation={3} sx={paperStyles} ref={messageContainerRef}>
          {messages.map((message, index) => (
              <MessageBubble
                  key={index}
                  message={message}
                  showThinking={(showThinking || isThinkingClosing) && isLastMessage(index) && message.thinking}
                  onToggleThinking={toggleThinking}
                  isThinkingClosing={isThinkingClosing && isLastMessage(index)}
                  animationDots={isLastMessage(index) && message.isStreaming ? dots : ''}
                  isMobile={isMobile}
              />
          ))}
          <div ref={messagesEndRef}/>
        </Paper>

        <form onSubmit={handleSendMessage} style={{display: 'flex'}}>
          <TextField
              fullWidth
              variant="outlined"
              placeholder={isMobile ? "Ask a dental question..." : "Ask about dental care, procedures, or concerns..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              multiline
              maxRows={isMobile ? 3 : 4}
              minRows={input.includes('\n') ? (isMobile ? 2 : 3) : 1}
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? '12px' : '16px',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }
              }}
              InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                          type="submit"
                          disabled={!input.trim() || loading}
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                      >
                        <SendIcon fontSize={isMobile ? "small" : "medium"}/>
                      </IconButton>
                    </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) handleSendMessage(e);
                }
              }}
          />
        </form>
      </Box>
  );
};

export default ChatInterface; 