import OpenAI from 'openai';
import config from '../config';

// Internal cache so we do not create a new SDK instance for every request
const clientCache = new Map(); // key -> OpenAI instance


const getClient = (apiKeyParam) => {
  const apiKey = config?.api?.chatbot?.openaiApiKey;

  if (!apiKey) {
    throw new Error('No OpenAI API key available. Provide one as a parameter, set REACT_APP_OPENAI_API_KEY, or configure it in config.');
  }

  if (!clientCache.has(apiKey)) {
    clientCache.set(apiKey, new OpenAI({ apiKey, dangerouslyAllowBrowser: true }));
  }

  return clientCache.get(apiKey);
};

// New streaming logic (ported from former services/chatbot.js)
async function callChatBot(messages, onTokenReceived, apiKeyParam) {
  // apiKeyParam is optional; if provided, override default config key retrieval
  const client = getClient(apiKeyParam);

  try {
    const stream = await client.chat.completions.create({
      model: config?.api?.chatbot?.model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || '';
      if (token) {
        fullResponse += token;
        if (typeof onTokenReceived === 'function') onTokenReceived(token, fullResponse);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Error calling ChatBot via OpenAI SDK:', error);

    if (error?.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
}

// Higher-level helper that mirrors the simple chat logic used on the Welcome page.
// It converts that page's message format ( { sender, text } ) into OpenAI chat messages
// and prepends a system prompt so callers don't have to.
function botAssistant(previousMessages = [], userInput, onTokenReceived, apiKeyParam) {
  const systemMessage = {
    role: 'system',
    content: 'You are a helpful dental assistant chatbot. Provide concise, accurate information about dental care, procedures, and oral health.'
  };

  const openAIMessages = [
    systemMessage,
    ...previousMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userInput },
  ];

  return callChatBot(openAIMessages, onTokenReceived, apiKeyParam);
}

// -----------------------------------------------------------------------------
// Dentist-specific helper that works with the role/content message structure used
// in the ChatBotDentist page. It prepends a professional-dentist system prompt
// and normalises previous messages so they only contain the valid OpenAI roles
// ("user" and "assistant").
function botDentist(previousMessages = [], userInput, onTokenReceived, apiKeyParam) {
  const systemMessage = {
    role: 'system',
    content: 'You are a professional dentist AI assistant. Answer questions with clear, accurate, and practical dental advice. Keep responses empathetic, easy to understand, and, where appropriate, include brief preventive tips. If consultation with a real dentist is necessary, politely advise the user to seek professional care.'
  };

  const openAIMessages = [
    systemMessage,
    ...previousMessages.map((msg) => ({
      // Treat any previous message sent by user as 'user', otherwise as 'assistant'
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userInput },
  ];

  return callChatBot(openAIMessages, onTokenReceived, apiKeyParam);
}

export default { callChatBot, botAssistant, botDentist };
