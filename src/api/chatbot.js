import config from '../config';

const chatbotAPI = {
  callChatBot: async (messages, apiKey, onTokenReceived) => {
    // We're using the same API path for both environments now
    // The proxy middleware will handle routing in development
    // Nginx will handle routing in production
    
    const url = process.env.NODE_ENV === 'development'
      ? 'http://localhost:20000/v1/chat/completions'
      : '/api/deepseekr132b/chat/completions'; 
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey || config.chatbot.apiKey}`
        },
        body: JSON.stringify({
          model: config.chatbot.model || 'deepseek-r1-distill-qwen-32b',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: true // Enable streaming
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to call ChatBot API');
      }
  
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullResponse = '';
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk
        const chunk = decoder.decode(value);
        
        // Process each line in the chunk
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          // Skip the "data: [DONE]" message
          if (line === 'data: [DONE]') continue;
          
          // Remove the "data: " prefix
          const jsonData = line.replace(/^data: /, '');
          
          try {
            // Parse the JSON data
            const data = JSON.parse(jsonData);
            
            // Extract the token if it exists
            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
              const token = data.choices[0].delta.content;
              fullResponse += token;
              
              // Call the callback with the token
              if (onTokenReceived) {
                onTokenReceived(token, fullResponse);
              }
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error calling ChatBot:', error);
      throw error;
    }
  }
};

export default chatbotAPI;
