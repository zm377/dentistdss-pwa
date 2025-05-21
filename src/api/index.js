import authAPI from './auth';
import chatbotAPI from './chatbot';
import clinicAPI from './clinic';
const api = {
  auth: authAPI,
  chatbot: chatbotAPI,
  clinic: clinicAPI,
  // Add other API modules here as they're created
};

export default api;
