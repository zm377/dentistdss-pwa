/**
 * OpenAI utility type definitions for the dental clinic assistant
 *
 * This file provides TypeScript types from OpenAI SDK for better SSE processing
 * and data handling. All OpenAI API communication flows through the Spring AI backend.
 *
 * The frontend uses these types for:
 * - Enhanced SSE data parsing and validation
 * - Type safety for streaming response processing
 * - Message formatting and structure validation
 * - Better error handling and debugging
 */

import { ChatType, StreamCallback } from './common';

// Re-export OpenAI SDK types for utility use
export type {
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletion
} from 'openai/resources/chat/completions';

// Backend integration types for Spring AI communication
export interface BackendChatRequest {
  message: string;
  chatType: ChatType;
  userId?: number;
  sessionId?: string;
}

export interface BackendChatResponse {
  content: string;
  sessionId?: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// SSE event types for backend streaming
export interface SSEChatEvent {
  type: 'token' | 'complete' | 'error';
  data: string;
  sessionId?: string;
  finishReason?: string;
}

// Enhanced error handling for backend integration
export interface BackendChatError extends Error {
  status?: number;
  code?: string;
  type?: 'authentication' | 'rate_limit' | 'network' | 'server' | 'validation';
  retryable?: boolean;
}

// Session management types for backend integration
export interface BackendSession {
  sessionId: string;
  chatType: ChatType;
  userId?: number;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

// Utility types for SSE processing
export interface SSEProcessingOptions {
  enableTokenSpacing: boolean;
  validateChunks: boolean;
  logDebugInfo: boolean;
  maxRetries: number;
}

// Chat service interface for backend integration
export interface BackendChatService {
  help: (userInput: string, onTokenReceived?: StreamCallback) => Promise<string>;
  aidentist: (userInput: string, onTokenReceived?: StreamCallback) => Promise<string>;
  receptionist: (userInput: string, onTokenReceived?: StreamCallback) => Promise<string>;
  triage: (userInput: string, onTokenReceived?: StreamCallback) => Promise<string>;
  documentationSummarize: (userInput: string, onTokenReceived?: StreamCallback) => Promise<string>;
  isBackendIntegrationEnabled: () => boolean;
  getAuthStatus: () => any;
}
