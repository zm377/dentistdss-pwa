import config from '../config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: config.chatbot.openaiApiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const chatbotAPI = {
  callChatBot: async (messages, apiKeyParam, onTokenReceived) => {
    // The apiKeyParam parameter to this function can override the one in config
    const client = apiKeyParam ? new OpenAI({ apiKey: apiKeyParam, dangerouslyAllowBrowser: true }) : openai;

    try {
      const stream = await client.chat.completions.create({
        model: config.chatbot.model || 'gpt-4.1-nano-2025-04-14', // This model might not be an OpenAI model. User should verify.
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        if (token) {
          fullResponse += token;
          if (onTokenReceived) {
            onTokenReceived(token, fullResponse);
          }
        }
      }
      return fullResponse;

    } catch (error) {
      console.error('Error calling ChatBot with OpenAI SDK:', error);
      // Attempt to parse OpenAI specific error messages if available
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error.message || 'Failed to call ChatBot API via SDK');
      }
      throw error;
    }
  }
};

export default chatbotAPI;
