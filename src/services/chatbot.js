// Removed OpenAI import and config import as they were for OpenAI specific settings.
// import OpenAI from 'openai';
// import config from '../config';

// If session IDs are to be generated client-side by this service as a fallback,
// you might need a UUID library. Example:
// import { v4 as uuidv4 } from 'uuid';

// Core function to call the backend streaming API
async function streamApiCall(endpoint, prompt, sessionId, onTokenReceived, authToken = null) {
  const headers = {
    'Content-Type': 'text/plain', // Backend API expects plain text for the prompt
    // 'Accept': 'text/event-stream', // Usually set automatically by the browser for fetch with streaming
  };

  if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }
  // Note: If no sessionId is provided, the backend will generate one.
  // It's generally better for the client (UI component) to manage the sessionId's lifecycle.

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`; // Assuming Bearer token authentication
  }

  // Assuming the PWA and backend are served from the same origin, so relative URLs are used.
  // Change this if your API is hosted on a different domain/port.
  const fullUrl = `/api/genai/chatbot${endpoint}`; // e.g., endpoint is '/help' or '/aidentist'

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: headers,
      body: prompt,
    });

    if (!response.ok) {
      let errorText = `API call to ${fullUrl} failed with status ${response.status}`;
      try {
        const text = await response.text();
        errorText = text || errorText; // Use backend error message if available
      } catch (e) {
        // Ignore if can't read text
      }
      console.error(errorText);
      // Pass error to callback as if it's a message from the bot
      if (typeof onTokenReceived === 'function') {
        onTokenReceived(errorText, errorText);
      }
      throw new Error(errorText);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let cumulativeResponse = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Process any remaining data in the buffer if the stream ended abruptly
        // This is a fallback; well-formed SSE streams usually end cleanly.
        if (buffer.length > 0) {
            const lines = buffer.split('\\n'); // Split remaining buffer by newline
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const token = line.slice('data:'.length).trim();
                    if (token) {
                         cumulativeResponse += token;
                         if (typeof onTokenReceived === 'function') onTokenReceived(token, cumulativeResponse);
                    }
                }
            }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      let position;
      // Process complete SSE messages (terminated by double newline)
      while ((position = buffer.indexOf('\\n\\n')) >= 0) {
        const rawEventsBlock = buffer.slice(0, position);
        buffer = buffer.slice(position + 2); // Move past the '\\n\\n'

        const lines = rawEventsBlock.split('\\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const token = line.slice('data:'.length).trim();
            if (token) { // Ensure token is not empty
                cumulativeResponse += token;
                // The rate limit message from backend ("You have reached the maximal inquiries...")
                // will also arrive here as a token.
                if (typeof onTokenReceived === 'function') {
                  onTokenReceived(token, cumulativeResponse);
                }
            }
          }
          // Other SSE lines like 'event:', 'id:', 'retry:' could be handled here if needed.
        }
      }
    }
    return cumulativeResponse;
  } catch (error) {
    console.error('Error in streamApiCall:', error);
    if (typeof onTokenReceived === 'function') {
      const errorMessage = (error.message && error.message.includes("maximal inquiries"))
        ? error.message // Use the specific rate limit message if it caused an error throw
        : 'Sorry, I encountered an error processing your request. Please try again.';
      onTokenReceived(errorMessage, errorMessage);
    }
    throw error; // Re-throw so the caller can also handle it if needed
  }
}

// `botAssistant` calls the '/help' endpoint.
// No authentication required for this endpoint.
// `userInput`: The text from the user.
// `sessionId`: A unique identifier for the chat session (caller should manage this).
// `onTokenReceived`: Callback function (token, fullResponse) => void.
function botAssistant(userInput, sessionId, onTokenReceived) {
  return streamApiCall('/help', userInput, sessionId, onTokenReceived, null);
}

// `botDentist` calls the '/aidentist' endpoint.
// Requires authentication.
// `authToken`: The JWT or other token for authentication.
function botDentist(userInput, sessionId, onTokenReceived, authToken) {
  if (!authToken) {
    const authErrorMsg = 'Authentication required to access the AI Dentist. Please log in.';
    console.error(authErrorMsg);
    if (typeof onTokenReceived === 'function') {
      onTokenReceived(authErrorMsg, authErrorMsg);
    }
    return Promise.reject(new Error(authErrorMsg));
  }
  return streamApiCall('/aidentist', userInput, sessionId, onTokenReceived, authToken);
}

// TODO for the developer integrating this service:
// 1. Session ID Management: Ensure that `sessionId` is generated (e.g., using `uuid` library)
//    by the calling UI component at the start of a new chat session and passed consistently.
// 2. Authentication Token: For `botDentist`, ensure `authToken` is correctly retrieved
//    from your application's auth state (e.g., localStorage, Auth Context) and passed.
// 3. UI Updates: Adapt UI components to provide `sessionId` and `authToken` where necessary.
//    The `onTokenReceived` callback behavior (receiving individual tokens and the cumulative response)
//    is maintained, so UI rendering of streamed text should largely remain compatible.
// 4. Rate Limiting: The backend's rate limit message ("You have reached the maximal inquiries...")
//    will be passed through `onTokenReceived`. The UI should display this message appropriately.
// 5. Additional Endpoints: If you need to use other chat agents from your backend
//    (e.g., /receptionist, /triage, /documentation/summarize), add new functions similar to
//    `botAssistant` or `botDentist`, calling the appropriate endpoint and handling auth if required.
// 6. If you use `uuid` for session IDs, make sure to install it: `npm install uuid` or `yarn add uuid`.

export default { botAssistant, botDentist };
