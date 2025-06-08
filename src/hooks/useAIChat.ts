import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/auth';
import api from '../services';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

type ChatType = 'help' | 'aidentist' | 'receptionist' | 'triage' | 'documentationSummarize';

type StreamCallback = (token: string, fullText: string) => void;

type ApiEndpoint = (content: string, sessionId: string, callback: StreamCallback) => Promise<any>;

interface UseAIChatReturn {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string;
  sessionId: string;
  sendMessage: (messageContent?: string | null, apiEndpoint?: ApiEndpoint | null) => Promise<void>;
  clearConversation: (newWelcomeMessage?: string | null) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  setQuickInput: (text: string) => void;
  setInputValue: (value: string) => void;
  setError: (error: string) => void;
  hasMessages: boolean;
  hasError: boolean;
}

/**
 * Custom hook for AI chat functionality
 *
 * Features:
 * - Session management with automatic ID generation
 * - Message state management
 * - Real-time SSE streaming support
 * - Error handling and loading states
 * - Reusable across different chat types
 */
const useAIChat = (chatType: ChatType = 'help', initialWelcomeMessage: string = ''): UseAIChatReturn => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Initialize session and welcome message
  useEffect(() => {
    const newSessionId = `${chatType}-${currentUser?.id || 'anonymous'}-${Date.now()}`;
    setSessionId(newSessionId);
    
    if (initialWelcomeMessage) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: initialWelcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [chatType, currentUser?.id, initialWelcomeMessage]);

  // Send message handler
  const sendMessage = useCallback(async (messageContent: string | null = null, apiEndpoint: ApiEndpoint | null = null): Promise<void> => {
    const content = messageContent || inputValue.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user' as const,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageContent) setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      // Create AI message placeholder
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Determine API endpoint
      let apiCall;
      if (apiEndpoint) {
        apiCall = apiEndpoint(content, sessionId, (token, fullText) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessage.id
                ? { ...msg, content: fullText, isStreaming: false }
                : msg
            )
          );
        });
      } else {
        // Default endpoint selection based on chatType
        switch (chatType) {
          case 'aidentist':
            apiCall = api.chatbot.aidentist(content, sessionId, (token, fullText) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, content: fullText, isStreaming: false }
                    : msg
                )
              );
            });
            break;
          case 'receptionist':
            apiCall = api.chatbot.receptionist(content, sessionId, (token, fullText) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, content: fullText, isStreaming: false }
                    : msg
                )
              );
            });
            break;
          case 'triage':
            apiCall = api.chatbot.triage(content, sessionId, (token, fullText) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, content: fullText, isStreaming: false }
                    : msg
                )
              );
            });
            break;
          case 'documentationSummarize':
            apiCall = api.chatbot.documentationSummarize(content, sessionId, (token, fullText) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, content: fullText, isStreaming: false }
                    : msg
                )
              );
            });
            break;
          case 'help':
          default:
            apiCall = api.chatbot.help(content, sessionId, (token, fullText) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, content: fullText, isStreaming: false }
                    : msg
                )
              );
            });
            break;
        }
      }

      await apiCall;
    } catch (error) {
      console.error('Error sending message:', error);
      setError((error as Error).message || 'Failed to send message. Please try again.');
      
      // Remove the failed AI message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, sessionId, chatType]);

  // Clear conversation
  const clearConversation = useCallback((newWelcomeMessage: string | null = null): void => {
    const welcomeMessage = newWelcomeMessage || initialWelcomeMessage;
    if (welcomeMessage) {
      setMessages([{
        id: Date.now(),
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    } else {
      setMessages([]);
    }
    setError('');
  }, [initialWelcomeMessage]);

  // Handle Enter key press
  const handleKeyPress = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Set predefined input
  const setQuickInput = useCallback((text: string): void => {
    setInputValue(text);
  }, []);

  return {
    // State
    messages,
    inputValue,
    isLoading,
    error,
    sessionId,
    
    // Actions
    sendMessage,
    clearConversation,
    handleKeyPress,
    setQuickInput,
    setInputValue,
    setError,
    
    // Convenience
    hasMessages: messages.length > 0,
    hasError: error.length > 0,
  };
};

export default useAIChat;
