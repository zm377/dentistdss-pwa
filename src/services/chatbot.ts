import config from '../config';
import { v4 as uuidv4 } from 'uuid';

/**
 * Chatbot API service following established service patterns
 * Handles Server-Sent Events (SSE) streaming responses from Spring WebFlux backend
 *
 * The Spring WebFlux service automatically formats each emitted string as an SSE event
 * by prefixing it with 'data:' before every individual token/word in the streaming response.
 */

// Type definitions for chatbot service
interface AuthData {
  token: string;
  tokenType: string;
}

interface AuthStatus {
  hasToken: boolean;
  tokenType?: string;
  tokenLength?: number;
  tokenPreview?: string | null;
  localStorage: {
    authToken: boolean;
    tokenType: string | null;
  };
}

type TokenCallback = (token: string, fullResponse: string) => void;

/**
 * Generates a UUID-based session ID for chatbot conversations
 * @returns UUID session ID
 */
function generateSessionId(): string {
  return uuidv4();
}

/**
 * Validates if a string is a proper UUID v4 format
 * @param uuid - String to validate
 * @returns True if valid UUID v4, false otherwise
 */
function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  // UUID v4 regex pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where x is any hexadecimal digit and y is one of 8, 9, A, or B
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}

/**
 * Ensures a valid UUID session ID is available, generating one if needed or invalid
 * @param sessionId - Existing session ID or null/undefined
 * @returns Valid UUID session ID (existing valid UUID or newly generated)
 */
function ensureSessionId(sessionId?: string | null): string {
  // If no session ID provided, generate a new one
  if (!sessionId) {
    const newSessionId = generateSessionId();
    console.log('No session ID provided, generated new UUID:', newSessionId);
    return newSessionId;
  }

  // If session ID is provided but not a valid UUID, generate a new one
  if (!isValidUUID(sessionId)) {
    const newSessionId = generateSessionId();
    console.warn(`Invalid session ID format detected: "${sessionId}". Generated new UUID: ${newSessionId}`);
    return newSessionId;
  }

  // Session ID is valid, use it
  console.log('Using existing valid UUID session ID:', sessionId);
  return sessionId;
}

/**
 * Gets authentication token from localStorage with validation
 * @returns Object with token and tokenType, or null if not available
 */
function getAuthToken(): AuthData | null {
  const token = localStorage.getItem('authToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';

  if (!token) {
    console.warn('No authentication token found in localStorage');
    return null;
  }

  // Basic token validation - check if it's not empty and looks like a JWT
  if (token.trim().length === 0) {
    console.warn('Empty authentication token found');
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    return null;
  }

  return { token, tokenType };
}


/**
 * Parses SSE data lines and extracts tokens with proper spacing
 * @param rawEventsBlock - Raw SSE event block to parse
 * @param cumulativeResponse - Current cumulative response
 * @param onTokenReceived - Callback for token processing
 * @returns Updated cumulative response
 */
function parseSSEDataLines(rawEventsBlock: string, cumulativeResponse: string, onTokenReceived?: TokenCallback): string {
  const lines = rawEventsBlock.split('\n');
  let updatedResponse = cumulativeResponse;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('data:')) {
      const token = trimmedLine.slice('data:'.length).trim();
      if (token && token !== '[DONE]' && token !== 'null') { // Filter out termination signals and null values
        // Add space before token if response already has content and token doesn't start with punctuation
        const needsSpace = updatedResponse.length > 0 &&
                          !token.match(/^[.,!?;:)}\]"']/) &&
                          !updatedResponse.match(/[(\[{"'\s]$/);

        if (needsSpace) {
          updatedResponse += ' ' + token;
        } else {
          updatedResponse += token;
        }

        // The rate limit message from backend ("You have reached the maximal inquiries...")
        // will also arrive here as a token.
        if (typeof onTokenReceived === 'function') {
          onTokenReceived(token, updatedResponse);
        }
      }
    }
    // Handle other SSE event types if needed
    else if (trimmedLine.startsWith('event:')) {
      const eventType = trimmedLine.slice('event:'.length).trim();
      // Could handle different event types here (e.g., 'error', 'complete', etc.)
      if (eventType === 'error') {
        console.warn('SSE Error event received');
      }
    }
    // Handle retry directive
    else if (trimmedLine.startsWith('retry:')) {
      const retryTime = parseInt(trimmedLine.slice('retry:'.length).trim(), 10);
      console.log(`SSE retry time: ${retryTime}ms`);
    }
  }

  return updatedResponse;
}

// Core function to call the backend streaming API using fetch for streaming support
async function streamApiCall(endpoint: string, prompt: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'text/plain', // Send prompt as plain text
    'Accept': 'text/event-stream', // Expect SSE response from Spring WebFlux
    'Cache-Control': 'no-cache', // Prevent caching of SSE streams
  };

  // Ensure we have a valid UUID session ID
  const validSessionId = ensureSessionId(sessionId);
  headers['X-Session-Id'] = validSessionId;

  // Add authentication token with improved validation
  const authData = getAuthToken();
  if (authData) {
    headers['Authorization'] = `${authData.tokenType} ${authData.token}`;
    console.log(`Making authenticated request to ${endpoint} with token type: ${authData.tokenType}`);
  } else {
    console.warn(`No valid authentication token available for ${endpoint}`);
    // For endpoints that require authentication, this will result in a 401 error
    // which is handled below
  }

  // Use the same base URL pattern as other services
  const baseURL = config.api.baseUrl;
  const fullUrl = `${baseURL}/api/genai/chatbot${endpoint}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: headers,
      body: prompt,
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      let errorMessage = `API call failed with status ${response.status}`;
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch (e) {
        // Ignore if can't read text
      }

      console.error(`Chatbot API Error for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        url: fullUrl,
        hasAuthToken: !!authData,
        tokenType: authData?.tokenType
      });

      // Handle authentication errors following established pattern
      if (response.status === 401) {
        console.error('Authentication failed - clearing stored tokens');
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');

        // Provide more specific error message based on context
        const authErrorMessage = authData
          ? 'Your session has expired. Please log in again.'
          : 'Authentication required. Please log in to access this feature.';

        // Dispatch error event following established pattern
        const event = new CustomEvent('show-snackbar', {
          detail: {
            message: authErrorMessage,
            severity: 'error',
          },
        });
        window.dispatchEvent(event);

        // Also redirect to login after a short delay to allow user to see the message
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 2000);
      }

      // Pass error to callback
      if (typeof onTokenReceived === 'function') {
        onTokenReceived(errorMessage, errorMessage);
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let cumulativeResponse = '';

    // Verify we're getting the expected content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('text/event-stream')) {
      console.warn(`Expected text/event-stream but got: ${contentType}`);
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const {value, done} = await reader.read();
      if (done) {
        // Process any remaining data in the buffer if the stream ended abruptly
        // This is a fallback; well-formed SSE streams usually end cleanly.
        if (buffer.length > 0) {
          // Use the utility function to parse remaining buffer with proper spacing
          cumulativeResponse = parseSSEDataLines(buffer, cumulativeResponse, onTokenReceived);
        }
        break;
      }

      buffer += decoder.decode(value, {stream: true});

      let position;
      // Process complete SSE messages (terminated by double newline)
      while ((position = buffer.indexOf('\n\n')) >= 0) {
        const rawEventsBlock = buffer.slice(0, position);
        buffer = buffer.slice(position + 2); // Move past the '\n\n'

        // Use the utility function to parse SSE data lines with proper spacing
        cumulativeResponse = parseSSEDataLines(rawEventsBlock, cumulativeResponse, onTokenReceived);
      }
    }
    return cumulativeResponse;
  } catch (error) {
    console.error('Error in streamApiCall:', error);

    // Determine appropriate error message
    let userMessage = 'Sorry, I encountered an error processing your request. Please try again.';
    const errorMessage = (error as Error).message;
    if (errorMessage && errorMessage.includes("maximal inquiries")) {
      userMessage = errorMessage; // Use specific rate limit message
    }

    // Dispatch error event following established pattern
    const event = new CustomEvent('show-snackbar', {
      detail: {
        message: userMessage,
        severity: 'error',
      },
    });
    window.dispatchEvent(event);

    // Pass error to callback
    if (typeof onTokenReceived === 'function') {
      onTokenReceived(userMessage, userMessage);
    }

    throw error; // Re-throw for caller handling
  }
}

/**
 * Chatbot API following established service patterns
 * All endpoints return promises and handle streaming responses
 */
const chatbotAPI = {
  /**
   * General help chatbot - no authentication required
   * @param userInput - The user's message
   * @param sessionId - Session identifier for conversation continuity (optional - UUID will be generated if not provided)
   * @param onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns Complete response text
   */
  async help(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    const validSessionId = ensureSessionId(sessionId);
    const response = await streamApiCall('/help', userInput, validSessionId, onTokenReceived);
    return response;
  },

  /**
   * AI Dentist chatbot - requires authentication
   * @param userInput - The user's message
   * @param sessionId - Session identifier for conversation continuity (optional - UUID will be generated if not provided)
   * @param onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns Complete response text
   */
  async aidentist(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    const authData = getAuthToken();
    if (!authData) {
      const authErrorMsg = 'Authentication required to access the AI Dentist. Please log in.';
      console.error(authErrorMsg);

      // Dispatch error event for consistency
      const event = new CustomEvent('show-snackbar', {
        detail: {
          message: authErrorMsg,
          severity: 'error',
        },
      });
      window.dispatchEvent(event);

      if (typeof onTokenReceived === 'function') {
        onTokenReceived(authErrorMsg, authErrorMsg);
      }
      return Promise.reject(new Error(authErrorMsg));
    }
    const validSessionId = ensureSessionId(sessionId);
    const response = await streamApiCall('/aidentist', userInput, validSessionId, onTokenReceived);
    return response;
  },

  /**
   * Triage chatbot - requires authentication
   * @param userInput - The user's message
   * @param sessionId - Session identifier (optional - UUID will be generated if not provided)
   * @param onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns Complete response text
   */
  async triage(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    // Check authentication first
    const authData = getAuthToken();
    if (!authData) {
      const authErrorMsg = 'Authentication required to access the Triage chatbot. Please log in.';
      console.error(authErrorMsg);

      const event = new CustomEvent('show-snackbar', {
        detail: {
          message: authErrorMsg,
          severity: 'error',
        },
      });
      window.dispatchEvent(event);

      if (typeof onTokenReceived === 'function') {
        onTokenReceived(authErrorMsg, authErrorMsg);
      }
      return Promise.reject(new Error(authErrorMsg));
    }

    // Ensure we have a valid UUID session ID
    const validSessionId = ensureSessionId(sessionId);
    const response = await streamApiCall('/triage', userInput, validSessionId, onTokenReceived);
    return response;
  },

  /**
   * Receptionist chatbot - requires authentication
   * @param userInput - The user's message
   * @param sessionId - Session identifier (optional - UUID will be generated if not provided)
   * @param onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns Complete response text
   */
  async receptionist(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    // Check authentication first
    const authData = getAuthToken();
    if (!authData) {
      const authErrorMsg = 'Authentication required to access the Receptionist chatbot. Please log in.';
      console.error(authErrorMsg);

      const event = new CustomEvent('show-snackbar', {
        detail: {
          message: authErrorMsg,
          severity: 'error',
        },
      });
      window.dispatchEvent(event);

      if (typeof onTokenReceived === 'function') {
        onTokenReceived(authErrorMsg, authErrorMsg);
      }
      return Promise.reject(new Error(authErrorMsg));
    }

    // Ensure we have a valid UUID session ID
    const validSessionId = ensureSessionId(sessionId);
    const response = await streamApiCall('/receptionist', userInput, validSessionId, onTokenReceived);
    return response;
  },

  /**
   * Documentation summarization chatbot - requires authentication
   * @param userInput - The user's message
   * @param sessionId - Session identifier (optional - UUID will be generated if not provided)
   * @param onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns Complete response text
   */
  async documentationSummarize(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    // Check authentication first
    const authData = getAuthToken();
    if (!authData) {
      const authErrorMsg = 'Authentication required to access Documentation Summarization. Please log in.';
      console.error(authErrorMsg);

      const event = new CustomEvent('show-snackbar', {
        detail: {
          message: authErrorMsg,
          severity: 'error',
        },
      });
      window.dispatchEvent(event);

      if (typeof onTokenReceived === 'function') {
        onTokenReceived(authErrorMsg, authErrorMsg);
      }
      return Promise.reject(new Error(authErrorMsg));
    }

    // Ensure we have a valid UUID session ID
    const validSessionId = ensureSessionId(sessionId);
    const response = await streamApiCall('/documentation/summarize', userInput, validSessionId, onTokenReceived);
    return response;
  },

  // Legacy function names for backward compatibility
  botAssistant(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    return this.help(userInput, sessionId, onTokenReceived);
  },

  botDentist(userInput: string, sessionId?: string, onTokenReceived?: TokenCallback): Promise<string> {
    return this.aidentist(userInput, sessionId, onTokenReceived);
  },

  /**
   * Generate a new UUID session ID
   * @returns New UUID session ID
   */
  generateSessionId(): string {
    return generateSessionId();
  },

  /**
   * Validate if a session ID is a proper UUID v4 format
   * @param sessionId - Session ID to validate
   * @returns True if valid UUID v4, false otherwise
   */
  isValidSessionId(sessionId: string): boolean {
    return isValidUUID(sessionId);
  },

  /**
   * Debug utility to check authentication status
   * @returns Authentication status information
   */
  getAuthStatus(): AuthStatus {
    const authData = getAuthToken();
    return {
      hasToken: !!authData,
      tokenType: authData?.tokenType,
      tokenLength: authData?.token?.length,
      // Don't log the actual token for security
      tokenPreview: authData?.token ? `${authData.token.substring(0, 10)}...` : null,
      localStorage: {
        authToken: !!localStorage.getItem('authToken'),
        tokenType: localStorage.getItem('tokenType')
      }
    };
  }
};

export default chatbotAPI;
