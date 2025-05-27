import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from './config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={config.api.google.clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register();
