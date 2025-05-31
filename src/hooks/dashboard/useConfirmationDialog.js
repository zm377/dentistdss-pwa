import { useState } from 'react';

/**
 * Custom hook for managing confirmation dialog state and actions
 * 
 * Features:
 * - Centralized dialog state management
 * - Support for different dialog types (success, error, warning, info)
 * - Automatic state cleanup
 * - Easy integration with ConfirmationDialog component
 */
const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
  });

  /**
   * Show a confirmation dialog
   * @param {Object} config - Dialog configuration
   * @param {string} config.title - Dialog title
   * @param {string|React.Node} config.message - Dialog message
   * @param {string} config.type - Dialog type (success, error, warning, info)
   * @param {string} config.confirmText - Confirm button text
   */
  const showDialog = (config) => {
    setDialogConfig({
      title: config.title || 'Notification',
      message: config.message || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
    });
    setIsOpen(true);
  };

  /**
   * Show a success dialog
   * @param {string} title - Dialog title
   * @param {string|React.Node} message - Dialog message
   * @param {string} confirmText - Confirm button text
   */
  const showSuccess = (title, message, confirmText = 'OK') => {
    showDialog({
      title,
      message,
      type: 'success',
      confirmText,
    });
  };

  /**
   * Show an error dialog
   * @param {string} title - Dialog title
   * @param {string|React.Node} message - Dialog message
   * @param {string} confirmText - Confirm button text
   */
  const showError = (title, message, confirmText = 'OK') => {
    showDialog({
      title,
      message,
      type: 'error',
      confirmText,
    });
  };

  /**
   * Show a warning dialog
   * @param {string} title - Dialog title
   * @param {string|React.Node} message - Dialog message
   * @param {string} confirmText - Confirm button text
   */
  const showWarning = (title, message, confirmText = 'OK') => {
    showDialog({
      title,
      message,
      type: 'warning',
      confirmText,
    });
  };

  /**
   * Show an info dialog
   * @param {string} title - Dialog title
   * @param {string|React.Node} message - Dialog message
   * @param {string} confirmText - Confirm button text
   */
  const showInfo = (title, message, confirmText = 'OK') => {
    showDialog({
      title,
      message,
      type: 'info',
      confirmText,
    });
  };

  /**
   * Close the dialog and reset state
   */
  const closeDialog = () => {
    setIsOpen(false);
    // Reset config after a short delay to allow for exit animation
    setTimeout(() => {
      setDialogConfig({
        title: '',
        message: '',
        type: 'info',
        confirmText: 'OK',
      });
    }, 300);
  };

  return {
    // State
    isOpen,
    dialogConfig,
    
    // Actions
    showDialog,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeDialog,
    
    // Convenience props for ConfirmationDialog
    dialogProps: {
      open: isOpen,
      onClose: closeDialog,
      title: dialogConfig.title,
      message: dialogConfig.message,
      type: dialogConfig.type,
      confirmText: dialogConfig.confirmText,
    },
  };
};

export default useConfirmationDialog;
