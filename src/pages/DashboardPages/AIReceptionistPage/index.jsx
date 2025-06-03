import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  List,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  LocalHospital as TriageIcon,
  SupportAgent as ReceptionistIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/auth';
import useAIChat from '../../../hooks/useAIChat';
import ChatHeader from '../../../components/shared/ChatComponents/ChatHeader';
import ChatMessage from '../../../components/shared/ChatComponents/ChatMessage';
import ChatInput from '../../../components/shared/ChatComponents/ChatInput';
import { getWelcomeMessage, getQuickActions } from '../../../utils/chatUtils';
import api from '../../../services';

/**
 * AIReceptionistPage - AI chat interface for patients
 *
 * Features:
 * - Default receptionist mode using api.chatbot.receptionist
 * - Activatable "AI Triage" tab for api.chatbot.triage
 * - Real-time SSE streaming responses
 * - Session management for conversation continuity
 * - Material-UI consistent design
 */
const AIReceptionistPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0: Receptionist, 1: Triage

  // Get current chat type and welcome message
  const currentChatType = activeTab === 0 ? 'receptionist' : 'triage';
  const welcomeMessage = getWelcomeMessage(currentChatType, 'PATIENT', currentUser);

  // Use AI chat hook
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
  } = useAIChat(currentChatType, welcomeMessage);

  // Handle tab change
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);

    // Clear conversation with new welcome message
    const newChatType = newValue === 0 ? 'receptionist' : 'triage';
    const newWelcomeMessage = getWelcomeMessage(newChatType, 'PATIENT', currentUser);
    clearConversation(newWelcomeMessage);
  }, [clearConversation, currentUser]);

  // Handle message sending with custom API endpoint
  const handleSendMessage = useCallback(async () => {
    const apiEndpoint = activeTab === 0 ? api.chatbot.receptionist : api.chatbot.triage;
    await sendMessage(null, apiEndpoint);
  }, [sendMessage, activeTab]);

  // Get quick actions for current mode
  const quickActions = getQuickActions(currentChatType, setQuickInput);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToyIcon color="primary" />
        AI Assistant
      </Typography>

      <Paper elevation={2} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Tab Header */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="AI assistant modes">
            <Tab
              icon={<ReceptionistIcon />}
              label="Receptionist"
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab
              icon={<TriageIcon />}
              label="AI Triage"
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>

          <ChatHeader
            icon={activeTab === 0 ? <ReceptionistIcon color="primary" /> : <TriageIcon color="primary" />}
            title={activeTab === 0 ? 'Receptionist Mode' : 'Triage Mode'}
            subtitle={activeTab === 0 ?
              'Ask about appointments, clinic services, or general information' :
              'Describe your symptoms or dental concerns for assessment'
            }
            onClear={clearConversation}
            showClearButton={true}
          />
        </Box>

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
                aiAvatar={activeTab === 0 ? <ReceptionistIcon /> : <TriageIcon />}
                currentUser={currentUser}
              />
            ))}
          </List>
        </Box>

        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          placeholder={activeTab === 0 ?
            "Ask about appointments, clinic services, or general information..." :
            "Describe your symptoms or dental concerns..."
          }
          isLoading={isLoading}
          quickActions={quickActions}
        />
      </Paper>
    </Box>
  );
};

export default AIReceptionistPage;
