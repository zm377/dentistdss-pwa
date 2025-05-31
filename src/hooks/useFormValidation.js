import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation with real-time feedback
 *
 * Features:
 * - Email format validation
 * - Password confirmation validation
 * - Real-time validation on change and blur events
 * - Consistent error messaging
 * - Form validity state management
 */
export const useFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {string} Error message or empty string if valid
   */
  const validateEmail = useCallback((email) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  }, []);

  /**
   * Validate password confirmation
   * @param {string} password - Original password
   * @param {string} confirmPassword - Password confirmation
   * @returns {string} Error message or empty string if valid
   */
  const validatePasswordConfirmation = useCallback((password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  }, []);

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {string} Error message or empty string if valid
   */
  const validateUrl = useCallback((url) => {
    if (!url) {
      return ''; // URL is optional, so empty is valid
    }

    // Check if URL starts with http:// or https://
    const urlRegex = /^https?:\/\/.+/i;
    if (!urlRegex.test(url)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }

    // Additional validation for basic URL structure
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  }, []);

  /**
   * Validate a specific field
   * @param {string} fieldName - Name of the field to validate
   * @param {any} value - Value to validate
   * @param {Object} formData - Complete form data for cross-field validation
   * @returns {string} Error message or empty string if valid
   */
  const validateField = useCallback((fieldName, value, formData = {}) => {
    let error = '';

    switch (fieldName) {
      case 'email':
      case 'businessEmail':
        error = validateEmail(value);
        break;
      case 'confirmPassword':
        error = validatePasswordConfirmation(formData.password || '', value);
        break;
      case 'website':
        error = validateUrl(value);
        break;
      default:
        // No specific validation for other fields
        break;
    }

    return error;
  }, [validateEmail, validatePasswordConfirmation, validateUrl]);

  /**
   * Handle field change with validation
   * @param {string} fieldName - Name of the field
   * @param {any} value - New value
   * @param {Object} formData - Complete form data
   */
  const handleFieldChange = useCallback((fieldName, value, formData = {}) => {
    // Only validate if field has been touched or if it's a password confirmation field
    if (touchedFields[fieldName] || fieldName === 'confirmPassword') {
      const error = validateField(fieldName, value, formData);
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }

    // Special case: if password changes, re-validate confirmPassword
    if (fieldName === 'password' && formData.confirmPassword && touchedFields.confirmPassword) {
      const confirmError = validatePasswordConfirmation(value, formData.confirmPassword);
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  }, [touchedFields, validateField, validatePasswordConfirmation]);

  /**
   * Handle field blur with validation
   * @param {string} fieldName - Name of the field
   * @param {any} value - Current value
   * @param {Object} formData - Complete form data
   */
  const handleFieldBlur = useCallback((fieldName, value, formData = {}) => {
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Validate the field
    const error = validateField(fieldName, value, formData);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, [validateField]);

  /**
   * Check if form has any validation errors
   * @param {Array<string>} fieldsToCheck - Array of field names to check
   * @returns {boolean} True if form is valid, false otherwise
   */
  const isFormValid = useCallback((fieldsToCheck = []) => {
    if (fieldsToCheck.length === 0) {
      // Check all errors
      return Object.values(validationErrors).every(error => !error);
    }

    // Check specific fields
    return fieldsToCheck.every(field => !validationErrors[field]);
  }, [validationErrors]);

  /**
   * Get error message for a specific field
   * @param {string} fieldName - Name of the field
   * @returns {string} Error message or empty string
   */
  const getFieldError = useCallback((fieldName) => {
    return validationErrors[fieldName] || '';
  }, [validationErrors]);

  /**
   * Check if a field has an error
   * @param {string} fieldName - Name of the field
   * @returns {boolean} True if field has error, false otherwise
   */
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(validationErrors[fieldName]);
  }, [validationErrors]);

  /**
   * Clear all validation errors
   */
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
    setTouchedFields({});
  }, []);

  /**
   * Clear validation error for a specific field
   * @param {string} fieldName - Name of the field
   */
  const clearFieldError = useCallback((fieldName) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  return {
    validationErrors,
    touchedFields,
    validateEmail,
    validatePasswordConfirmation,
    validateUrl,
    validateField,
    handleFieldChange,
    handleFieldBlur,
    isFormValid,
    getFieldError,
    hasFieldError,
    clearValidationErrors,
    clearFieldError
  };
};

export default useFormValidation;
