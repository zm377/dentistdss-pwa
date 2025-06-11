/**
 * Enhanced SSE (Server-Sent Events) Utilities
 * 
 * Uses OpenAI SDK types and utilities for better SSE data processing
 * while maintaining backend-only OpenAI integration through Spring AI.
 */

// Import OpenAI SDK types for better type safety
import type { ChatCompletionChunk } from 'openai/resources/chat/completions';

// Type definitions for SSE processing
export interface SSEEvent {
  type: string;
  data: string;
  id?: string;
  retry?: number;
}

export interface SSEParseResult {
  events: SSEEvent[];
  remainingBuffer: string;
}

export interface StreamingToken {
  content: string;
  isComplete: boolean;
  finishReason?: string | null;
}

export type TokenCallback = (token: string, fullResponse: string) => void;

/**
 * Parse SSE event block into structured events
 */
export function parseSSEEvents(eventBlock: string): SSEEvent[] {
  const lines = eventBlock.split('\n');
  const events: SSEEvent[] = [];
  let currentEvent: Partial<SSEEvent> = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      // Empty line indicates end of event
      if (currentEvent.data !== undefined) {
        events.push({
          type: currentEvent.type || 'message',
          data: currentEvent.data,
          id: currentEvent.id,
          retry: currentEvent.retry,
        });
      }
      currentEvent = {};
    } else if (trimmedLine.startsWith('data:')) {
      currentEvent.data = trimmedLine.slice('data:'.length).trim();
    } else if (trimmedLine.startsWith('event:')) {
      currentEvent.type = trimmedLine.slice('event:'.length).trim();
    } else if (trimmedLine.startsWith('id:')) {
      currentEvent.id = trimmedLine.slice('id:'.length).trim();
    } else if (trimmedLine.startsWith('retry:')) {
      const retryValue = parseInt(trimmedLine.slice('retry:'.length).trim(), 10);
      if (!isNaN(retryValue)) {
        currentEvent.retry = retryValue;
      }
    }
  }

  return events;
}

/**
 * Process SSE buffer and extract complete events
 */
export function processSSEBuffer(buffer: string): SSEParseResult {
  const events: SSEEvent[] = [];
  let remainingBuffer = buffer;
  let position: number;

  // Process complete SSE messages (terminated by double newline)
  while ((position = remainingBuffer.indexOf('\n\n')) >= 0) {
    const eventBlock = remainingBuffer.slice(0, position);
    remainingBuffer = remainingBuffer.slice(position + 2);

    if (eventBlock.trim()) {
      const parsedEvents = parseSSEEvents(eventBlock);
      events.push(...parsedEvents);
    }
  }

  return {
    events,
    remainingBuffer,
  };
}

/**
 * Extract streaming token from SSE data using OpenAI-compatible format
 */
export function extractStreamingToken(data: string): StreamingToken | null {
  if (!data || data === '[DONE]' || data === 'null') {
    return {
      content: '',
      isComplete: true,
      finishReason: 'stop',
    };
  }

  try {
    // Try to parse as OpenAI-compatible JSON chunk
    const chunk = JSON.parse(data) as ChatCompletionChunk;
    
    if (chunk.choices && chunk.choices[0]) {
      const choice = chunk.choices[0];
      const content = choice.delta?.content || '';
      const finishReason = choice.finish_reason;
      
      return {
        content,
        isComplete: !!finishReason,
        finishReason,
      };
    }
  } catch (error) {
    // If not JSON, treat as plain text token (fallback for simple SSE)
    return {
      content: data,
      isComplete: false,
      finishReason: null,
    };
  }

  return null;
}

/**
 * Enhanced SSE data processing with proper token spacing
 */
export function processSSEDataWithSpacing(
  rawEventsBlock: string,
  cumulativeResponse: string,
  onTokenReceived?: TokenCallback
): string {
  const events = parseSSEEvents(rawEventsBlock);
  let updatedResponse = cumulativeResponse;

  for (const event of events) {
    if (event.type === 'error') {
      console.warn('SSE Error event received:', event.data);
      continue;
    }

    if (event.retry) {
      console.log(`SSE retry time: ${event.retry}ms`);
      continue;
    }

    const token = extractStreamingToken(event.data);
    if (!token || !token.content) {
      continue;
    }

    // Add intelligent spacing between tokens
    const needsSpace = updatedResponse.length > 0 &&
                      !token.content.match(/^[.,!?;:)}\]"']/) &&
                      !updatedResponse.match(/[(\[{"'\s]$/);

    if (needsSpace) {
      updatedResponse += ' ' + token.content;
    } else {
      updatedResponse += token.content;
    }

    // Call the streaming callback
    if (typeof onTokenReceived === 'function') {
      onTokenReceived(token.content, updatedResponse);
    }

    // Check if streaming is complete
    if (token.isComplete) {
      break;
    }
  }

  return updatedResponse;
}

/**
 * Validate SSE response headers
 */
export function validateSSEHeaders(response: Response): boolean {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('text/event-stream')) {
    console.warn(`Expected text/event-stream but got: ${contentType}`);
    return false;
  }

  return true;
}

/**
 * Create enhanced SSE reader with better error handling
 */
export async function createEnhancedSSEReader(
  response: Response,
  onTokenReceived?: TokenCallback
): Promise<string> {
  if (!validateSSEHeaders(response)) {
    throw new Error('Invalid SSE response headers');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let cumulativeResponse = '';

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        // Process any remaining data in the buffer
        if (buffer.length > 0) {
          cumulativeResponse = processSSEDataWithSpacing(
            buffer,
            cumulativeResponse,
            onTokenReceived
          );
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE events
      const parseResult = processSSEBuffer(buffer);
      buffer = parseResult.remainingBuffer;

      // Process each complete event
      for (const event of parseResult.events) {
        const eventBlock = `event: ${event.type}\ndata: ${event.data}\n`;
        cumulativeResponse = processSSEDataWithSpacing(
          eventBlock,
          cumulativeResponse,
          onTokenReceived
        );
      }
    }
  } finally {
    reader.releaseLock();
  }

  return cumulativeResponse;
}

/**
 * Utility to check if a string looks like OpenAI JSON chunk
 */
export function isOpenAIChunkFormat(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    return !!(parsed.choices && Array.isArray(parsed.choices));
  } catch {
    return false;
  }
}

/**
 * Format error message for SSE failures
 */
export function formatSSEError(error: any, endpoint: string): string {
  const baseMessage = `SSE streaming failed for ${endpoint}`;
  
  if (error.name === 'AbortError') {
    return `${baseMessage}: Request was aborted`;
  }
  
  if (error.message?.includes('network')) {
    return `${baseMessage}: Network connection error`;
  }
  
  if (error.message?.includes('timeout')) {
    return `${baseMessage}: Request timeout`;
  }
  
  return `${baseMessage}: ${error.message || 'Unknown error'}`;
}
