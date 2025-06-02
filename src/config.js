// Configuration constants for the application
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

// Default API settings
const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;
const API_ROOT_PATH = process.env.REACT_APP_API_ROOT_PATH;
const API_AUTH_PATH = API_ROOT_PATH + process.env.REACT_APP_API_AUTH_PATH;
const API_OAUTH_PATH = API_ROOT_PATH + process.env.REACT_APP_API_OAUTH_PATH;
const API_GENAI_PATH = API_ROOT_PATH + process.env.REACT_APP_API_GENAI_PATH;


// Google OAuth 
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const config = {
  // Environment info
  environment: {
    isDev: isDevelopment,
    isTest: isTest,
    isProd: isProduction,
  },

  api: {
    // baseUrl: isProduction ? `${API_HOST}` : `${API_HOST}:${API_PORT}`,
    baseUrl: `https://api.mizhifei.press`,
    authPath: API_AUTH_PATH,
    oauthPath: API_OAUTH_PATH,
    genaiPath: API_GENAI_PATH,

    // Chatbot-specific settings
    chatbot: {
      model: 'gpt-4.1-nano-2025-04-14',
    },

    // Google OAuth
    google: {
      clientId: GOOGLE_CLIENT_ID,
      mapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    },
  },

  // Application settings
  app: {
    name: 'Dentabot',
    version: '1.0.0',
  }
};

export default config;