// Configuration constants for the application
const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  // Environment info
  environment: {
    isDev: isDevelopment,
    isProd: !isDevelopment,
  },
  
  // ChatBot API configuration
  chatbot: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    model: 'c', // or whichever model you're using
  },
  
  api: {
    baseUrl: process.env.API_HOST || 'http://api.mizhifei.press',
    port: process.env.PORT || 443,
    path: process.env.API_PATH || '/v1/chat/completions',
  },
  
  // Application settings
  app: {
    name: 'DentistGPT',
    version: '1.0.0',
  }
};

export default config;