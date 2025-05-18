// Configuration constants for the application
const isDevelopment = process.env.NODE_ENV === 'development';

// Default API settings
const DEV_API_HOST = 'http://localhost';
const DEV_API_PORT = '8080';
const PROD_API_HOST = 'https://api.mizhifei.press';
const PROD_API_PORT = undefined;

// OpenAi API Keys
const OPENAI_API_KEY = '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';
const OPENAI_API_BASE_URL = 'https://api.openai.com';
const OPENAI_API_PATH = '/v1/chat/completions';

const config = {
  // Environment info
  environment: {
    isDev: isDevelopment,
    isProd: !isDevelopment,
  },
  
  // ChatBot API configuration
  chatbot: {
    baseUrl: process.env.OPENAI_API_BASE_URL || OPENAI_API_BASE_URL,
    openaiApiPath: process.env.OPENAI_API_PATH || OPENAI_API_PATH,
    openaiApiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY,
    model: 'gpt-4.1-nano-2025-04-14', // or whichever model you're using
  },
  
  api: {
    baseUrl: isDevelopment 
      ? `${process.env.API_HOST || DEV_API_HOST}:${process.env.API_PORT || DEV_API_PORT}` 
      : (process.env.API_HOST || PROD_API_HOST),
    genaiPath: process.env.API_PATH || '/v1/chat/completions',
  },
  
  // Application settings
  app: {
    name: 'DentistDSS',
    version: '1.0.0',
  }
};

export default config;