import authAPI from './auth';
import chatbotAPI from './chatbot';

const api = {
  auth: authAPI,
  chatbot: chatbotAPI,
  // Add other API modules here as they're created
};

export default api;
