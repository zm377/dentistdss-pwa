/**
 * Common types used throughout the dental clinic assistant application
 */

// Base entity interface
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
}

// Country interface for dictionary
export interface Country {
  code: string;
  name: string;
}

// Theme mode
export type ThemeMode = 'light' | 'dark';

// Urgency levels
export type UrgencyLevel = 'low' | 'medium' | 'high';

// Appointment status
export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show' 
  | 'rescheduled';

// User roles - matching backend format (uppercase)
export type UserRole =
  | 'PATIENT'
  | 'DENTIST'
  | 'CLINIC_ADMIN'
  | 'RECEPTIONIST'
  | 'SYSTEM_ADMIN';

// Message types
export type MessageType = 'info' | 'warning' | 'error' | 'success';

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}
