import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  List,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  MedicalServices as DentistIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/auth';
import useAIChat from '../../../hooks/useAIChat';
import ChatHeader from '../../../components/shared/ChatComponents/ChatHeader';
import ChatMessage from '../../../components/shared/ChatComponents/ChatMessage';
import ChatInput from '../../../components/shared/ChatComponents/ChatInput';
import { getWelcomeMessage, getQuickActions } from '../../../utils/chatUtils';

/**
 * AIDentistPage - AI clinical assistant for dentists
 *
 * Features:
 * - Uses api.chatbot.aidentist for dental consultation
 * - Real-time SSE streaming responses
 * - Session management for conversation continuity
 * - Clinical decision support interface
 * - Material-UI consistent design
 */
const AIDentistPage = () => {
  const { currentUser } = useAuth();

  // Get welcome message and use AI chat hook
  const welcomeMessage = getWelcomeMessage('aidentist', 'DENTIST', currentUser);
  const {
    messages,
    inputValue,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    handleKeyPress,
    setQuickInput,
    setInputValue,
  } = useAIChat('aidentist', welcomeMessage);

  // Get quick actions
  const quickActions = getQuickActions('aidentist', setQuickInput);



  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToyIcon color="primary" />
        AI Clinical Assistant
      </Typography>

      <Paper elevation={2} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <ChatHeader
          icon={<DentistIcon color="primary" />}
          title="AI Dentist - Clinical Decision Support"
          subtitle="Ask about patient symptoms, treatment options, clinical guidelines, or diagnostic support"
          onClear={clearConversation}
        />

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <List sx={{ width: '100%' }}>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userAvatar={`Dr. ${currentUser?.lastName?.charAt(0) || 'D'}`}
                aiAvatar={<DentistIcon />}
                currentUser={currentUser}
              />
            ))}
          </List>
        </Box>

        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
          placeholder="Ask about patient symptoms, treatment options, clinical guidelines..."
          isLoading={isLoading}
          quickActions={quickActions}
        />
      </Paper>
    </Box>
  );
};

export default AIDentistPage;
