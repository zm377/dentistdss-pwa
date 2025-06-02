import config from '../config';

/**
 * Chatbot API service following established service patterns
 * Handles Server-Sent Events (SSE) streaming responses from Spring WebFlux backend
 *
 * The Spring WebFlux service automatically formats each emitted string as an SSE event
 * by prefixing it with 'data:' before every individual token/word in the streaming response.
 */

/**
 * Validates that a session ID is provided for endpoints that require it
 * @param {string} sessionId - The session ID to validate
 * @param {function} onTokenReceived - Callback function for error handling
 * @returns {boolean} True if valid, false if invalid (and error is handled)
 */
function validateSessionId(sessionId, onTokenReceived) {
  if (!sessionId) {
    const sessionErrorMsg = 'Session ID is required for this chatbot endpoint.';
    console.error(sessionErrorMsg);
    if (typeof onTokenReceived === 'function') {
      onTokenReceived(sessionErrorMsg, sessionErrorMsg);
    }
    return false;
  }
  return true;
}

/**
 * Parses SSE data lines and extracts tokens with proper spacing
 * @param {string} rawEventsBlock - Raw SSE event block to parse
 * @param {string} cumulativeResponse - Current cumulative response
 * @param {function} onTokenReceived - Callback for token processing
 * @returns {string} Updated cumulative response
 */
function parseSSEDataLines(rawEventsBlock, cumulativeResponse, onTokenReceived) {
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
async function streamApiCall(endpoint, prompt, sessionId, onTokenReceived) {
  const headers = {
    'Content-Type': 'text/plain', // Send prompt as plain text
    'Accept': 'text/event-stream', // Expect SSE response from Spring WebFlux
    'Cache-Control': 'no-cache', // Prevent caching of SSE streams
  };

  // Add session ID header if provided
  if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }

  // Add authentication token from localStorage (following established pattern)
  const token = localStorage.getItem('authToken');
  const tokenType = localStorage.getItem('tokenType');
  if (token) {
    headers['Authorization'] = `${tokenType} ${token}`;
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

      console.error('Chatbot API Error:', errorMessage);

      // Handle authentication errors following established pattern
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        // Dispatch error event following established pattern
        const event = new CustomEvent('show-snackbar', {
          detail: {
            message: 'Authentication required. Please log in.',
            severity: 'error',
          },
        });
        window.dispatchEvent(event);
      }

      // Pass error to callback
      if (typeof onTokenReceived === 'function') {
        onTokenReceived(errorMessage, errorMessage);
      }
      throw new Error(errorMessage);
    }

    const reader = response.body.getReader();
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
    if (error.message && error.message.includes("maximal inquiries")) {
      userMessage = error.message; // Use specific rate limit message
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
   * @param {string} userInput - The user's message
   * @param {string} sessionId - Session identifier for conversation continuity
   * @param {function} onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns {Promise<string>} Complete response text
   */
  async help(userInput, sessionId, onTokenReceived) {
    return streamApiCall('/help', userInput, sessionId, onTokenReceived);
  },

  /**
   * AI Dentist chatbot - requires authentication
   * @param {string} userInput - The user's message
   * @param {string} sessionId - Session identifier for conversation continuity
   * @param {function} onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns {Promise<string>} Complete response text
   */
  async aidentist(userInput, sessionId, onTokenReceived) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      const authErrorMsg = 'Authentication required to access the AI Dentist. Please log in.';
      console.error(authErrorMsg);
      if (typeof onTokenReceived === 'function') {
        onTokenReceived(authErrorMsg, authErrorMsg);
      }
      return Promise.reject(new Error(authErrorMsg));
    }
    return streamApiCall('/aidentist', userInput, sessionId, onTokenReceived);
  },

  /**
   * Triage chatbot - requires authentication and session ID
   * @param {string} userInput - The user's message
   * @param {string} sessionId - Session identifier (required)
   * @param {function} onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns {Promise<string>} Complete response text
   */
  async triage(userInput, sessionId, onTokenReceived) {
    if (!validateSessionId(sessionId, onTokenReceived)) {
      return Promise.reject(new Error('Session ID is required for triage chatbot.'));
    }
    return streamApiCall('/triage', userInput, sessionId, onTokenReceived);
  },

  /**
   * Receptionist chatbot - requires authentication and session ID
   * @param {string} userInput - The user's message
   * @param {string} sessionId - Session identifier (required)
   * @param {function} onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns {Promise<string>} Complete response text
   */
  async receptionist(userInput, sessionId, onTokenReceived) {
    if (!validateSessionId(sessionId, onTokenReceived)) {
      return Promise.reject(new Error('Session ID is required for receptionist chatbot.'));
    }
    return streamApiCall('/receptionist', userInput, sessionId, onTokenReceived);
  },

  /**
   * Documentation summarization chatbot - requires authentication and session ID
   * @param {string} userInput - The user's message
   * @param {string} sessionId - Session identifier (required)
   * @param {function} onTokenReceived - Callback for streaming tokens (token, fullResponse) => void
   * @returns {Promise<string>} Complete response text
   */
  async documentationSummarize(userInput, sessionId, onTokenReceived) {
    if (!validateSessionId(sessionId, onTokenReceived)) {
      return Promise.reject(new Error('Session ID is required for documentation summarization.'));
    }
    return streamApiCall('/documentation/summarize', userInput, sessionId, onTokenReceived);
  },

  // Legacy function names for backward compatibility
  botAssistant(userInput, sessionId, onTokenReceived) {
    return this.help(userInput, sessionId, onTokenReceived);
  },

  botDentist(userInput, sessionId, onTokenReceived) {
    return this.aidentist(userInput, sessionId, onTokenReceived);
  }
};

export default chatbotAPI;
