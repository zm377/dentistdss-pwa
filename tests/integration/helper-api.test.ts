import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import api from '../../src/services';
import type { TokenCallback } from '../../src/utils/sseUtils';

// Mock the SSE utilities
vi.mock('../../src/utils/sseUtils', () => ({
  createEnhancedSSEReader: vi.fn(),
  formatSSEError: vi.fn((error: Error, endpoint: string) => `SSE error for ${endpoint}: ${error.message}`)
}));

// Mock fetch globally
(global as any).fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.dispatchEvent
const mockDispatchEvent = vi.fn();
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent
});

describe('Helper Component API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset localStorage mocks
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
    
    // Reset fetch mock
    (fetch as MockedFunction<typeof fetch>).mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Successful API Responses', () => {
    it('should handle successful help API response', async () => {
      const mockResponse = new Response('data: Hello\n\ndata: world\n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('Hello world');

      const callback: MockedFunction<TokenCallback> = vi.fn();
      const result = await api.chatbot.help('Test message', callback);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/genai/chatbot/help'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'text/plain',
            'Accept': 'text/event-stream'
          }),
          body: 'Test message'
        })
      );
      
      expect(createEnhancedSSEReader).toHaveBeenCalledWith(mockResponse, callback);
      expect(result).toBe('Hello world');
    });

    it('should handle streaming tokens correctly', async () => {
      const mockResponse = new Response('', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      
      // Mock streaming behavior
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockImplementation(
        async (response: Response, callback?: TokenCallback) => {
          if (callback) {
            // Simulate streaming tokens
            callback('Hello', 'Hello');
            callback(' there', 'Hello there');
            callback('!', 'Hello there!');
          }
          return 'Hello there!';
        }
      );

      const callback: MockedFunction<TokenCallback> = vi.fn();
      const result = await api.chatbot.help('Hello', callback);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, 'Hello', 'Hello');
      expect(callback).toHaveBeenNthCalledWith(2, ' there', 'Hello there');
      expect(callback).toHaveBeenNthCalledWith(3, '!', 'Hello there!');
      expect(result).toBe('Hello there!');
    });

    it('should handle empty response gracefully', async () => {
      const mockResponse = new Response('data: \n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('');

      const result = await api.chatbot.help('Empty test');
      expect(result).toBe('');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      (fetch as MockedFunction<typeof fetch>).mockRejectedValue(networkError);

      const callback: MockedFunction<TokenCallback> = vi.fn();
      
      await expect(api.chatbot.help('Test message', callback)).rejects.toThrow('Network connection failed');
      
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'show-snackbar',
          detail: expect.objectContaining({
            severity: 'error'
          })
        })
      );
    });

    it('should handle HTTP error responses', async () => {
      const errorResponse = new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(errorResponse);

      const callback: MockedFunction<TokenCallback> = vi.fn();
      
      await expect(api.chatbot.help('Test message', callback)).rejects.toThrow();
      
      expect(callback).toHaveBeenCalledWith(
        'Internal Server Error',
        'Internal Server Error'
      );
    });

    it('should handle authentication errors (401)', async () => {
      const authErrorResponse = new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized'
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(authErrorResponse);

      const callback: MockedFunction<TokenCallback> = vi.fn();
      
      await expect(api.chatbot.help('Test message', callback)).rejects.toThrow();
      
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new Error('You have reached the maximal inquiries for today');
      (fetch as MockedFunction<typeof fetch>).mockRejectedValue(rateLimitError);

      const callback: MockedFunction<TokenCallback> = vi.fn();
      
      await expect(api.chatbot.help('Test message', callback)).rejects.toThrow();
      
      expect(callback).toHaveBeenCalledWith(
        expect.stringContaining('maximal inquiries'),
        expect.stringContaining('maximal inquiries')
      );
    });

    it('should handle SSE streaming errors', async () => {
      const sseError = new Error('SSE streaming failed');
      (fetch as MockedFunction<typeof fetch>).mockRejectedValue(sseError);

      const callback: MockedFunction<TokenCallback> = vi.fn();
      
      await expect(api.chatbot.help('Test message', callback)).rejects.toThrow();
      
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'show-snackbar',
          detail: expect.objectContaining({
            message: expect.stringContaining('connection error'),
            severity: 'error'
          })
        })
      );
    });

    it('should handle malformed response headers', async () => {
      const malformedResponse = new Response('Invalid response', {
        status: 200,
        headers: { 'content-type': 'text/plain' } // Wrong content type
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(malformedResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockRejectedValue(
        new Error('Invalid SSE response headers')
      );

      await expect(api.chatbot.help('Test message')).rejects.toThrow('Invalid SSE response headers');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(10000);
      const mockResponse = new Response('data: Response\n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('Response');

      const result = await api.chatbot.help(longMessage);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: longMessage
        })
      );
      expect(result).toBe('Response');
    });

    it('should handle special characters in messages', async () => {
      const specialMessage = '🤖 Hello! How are you? 中文测试 @#$%^&*()';
      const mockResponse = new Response('data: Response\n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('Response');

      const result = await api.chatbot.help(specialMessage);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: specialMessage
        })
      );
      expect(result).toBe('Response');
    });

    it('should handle concurrent requests', async () => {
      const mockResponse = new Response('data: Response\n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('Response');

      // Send multiple concurrent requests
      const promises = [
        api.chatbot.help('Message 1'),
        api.chatbot.help('Message 2'),
        api.chatbot.help('Message 3')
      ];

      const results = await Promise.all(promises);
      
      expect(results).toEqual(['Response', 'Response', 'Response']);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle request timeout scenarios', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      
      (fetch as MockedFunction<typeof fetch>).mockRejectedValue(timeoutError);

      await expect(api.chatbot.help('Test message')).rejects.toThrow('Request timeout');
    });
  });

  describe('Callback Functionality', () => {
    it('should work without callback parameter', async () => {
      const mockResponse = new Response('data: Response\n\n', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockResolvedValue('Response');

      const result = await api.chatbot.help('Test message');
      
      expect(result).toBe('Response');
      expect(createEnhancedSSEReader).toHaveBeenCalledWith(mockResponse, undefined);
    });

    it('should handle callback errors gracefully', async () => {
      const mockResponse = new Response('', {
        status: 200,
        headers: { 'content-type': 'text/event-stream' }
      });

      (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);
      
      const { createEnhancedSSEReader } = await import('../../src/utils/sseUtils');
      
      const faultyCallback: TokenCallback = () => {
        throw new Error('Callback error');
      };

      // Should not throw even if callback throws
      (createEnhancedSSEReader as MockedFunction<typeof createEnhancedSSEReader>).mockImplementation(
        async (response: Response, callback?: TokenCallback) => {
          if (callback) {
            try {
              callback('token', 'full text');
            } catch (error) {
              // SSE reader should handle callback errors gracefully
              console.error('Callback error:', error);
            }
          }
          return 'Response';
        }
      );

      const result = await api.chatbot.help('Test message', faultyCallback);
      expect(result).toBe('Response');
    });
  });
});
