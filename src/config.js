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
const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;


const DIRTY_YEK = process.env.REACT_APP_DIRTY_YEK;
const DOUBLE_FACE = process.env.REACT_APP_DOUBLE_FACE;

// Decode the OpenAI key (two-step base64 with a salt called DOUBLE_FACE)
let OPENAI_API_KEY = undefined;
try {
  if (DIRTY_YEK && DOUBLE_FACE) {
    const step1 = atob(DIRTY_YEK).replace(DOUBLE_FACE, '');
    OPENAI_API_KEY = atob(step1).replace(DOUBLE_FACE, '');
  }
} catch (e) {
  // Fail silently – OPENAI_API_KEY remains undefined
}

const config = {
  // Environment info
  environment: {
    isDev: isDevelopment,
    isTest: isTest,
    isProd: isProduction,
  },
  
  api: {
    dirtyYek: DIRTY_YEK,
    doubleFace: DOUBLE_FACE,
    baseUrl: isProduction ? `${API_HOST}` : `${API_HOST}:${API_PORT}`,
    authPath: API_AUTH_PATH,
    oauthPath: API_OAUTH_PATH,
    genaiPath: API_GENAI_PATH,

    // Chatbot-specific settings
    chatbot: {
      openaiApiKey: OPENAI_API_KEY,
      model: process.env.REACT_APP_OPENAI_MODEL || 'gpt-4.1-nano-2025-04-14',
    },

    // Google OAuth
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  
  // Application settings
  app: {
    name: 'DentistDSS',
    version: '1.0.0',
  }
};

export default config;