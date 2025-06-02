import authAPI from './auth';
import chatbotAPI from './chatbot';
import clinicAPI from './clinic';
import approvalAPI from './approval';
import userAPI from './user';
import appointmentAPI from './appointment';
import messageAPI from './message';

const api = {
  auth: authAPI,
  chatbot: chatbotAPI,
  clinic: clinicAPI,
  approval: approvalAPI,
  user: userAPI,
  appointment: appointmentAPI,
  message: messageAPI,
  // Add other API modules here as they're created
};

export default api;
