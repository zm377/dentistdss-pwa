import { useState, ReactNode } from 'react';

type DialogType = 'success' | 'error' | 'warning' | 'info';

interface DialogConfig {
  title: string;
  message: string | ReactNode;
  type: DialogType;
  confirmText: string;
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  type: DialogType;
  confirmText: string;
}

interface UseConfirmationDialogReturn {
  // State
  isOpen: boolean;
  dialogConfig: DialogConfig;

  // Actions
  showDialog: (config: Partial<DialogConfig>) => void;
  showSuccess: (title: string, message: string | ReactNode, confirmText?: string) => void;
  showError: (title: string, message: string | ReactNode, confirmText?: string) => void;
  showWarning: (title: string, message: string | ReactNode, confirmText?: string) => void;
  showInfo: (title: string, message: string | ReactNode, confirmText?: string) => void;
  closeDialog: () => void;

  // Convenience props for ConfirmationDialog
  dialogProps: DialogProps;
}

const INITIAL_CONFIG: DialogConfig = {
  title: '',
  message: '',
  type: 'info',
  confirmText: 'OK',
};

/**
 * Custom hook for managing confirmation dialog state and actions
 *
 * Features:
 * - Centralized dialog state management
 * - Support for different dialog types (success, error, warning, info)
 * - Automatic state cleanup
 * - Easy integration with ConfirmationDialog component
 */
const useConfirmationDialog = (): UseConfirmationDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(INITIAL_CONFIG);

  /**
   * Show a confirmation dialog
   */
  const showDialog = (config: Partial<DialogConfig>): void => {
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
   */
  const showSuccess = (title: string, message: string | ReactNode, confirmText: string = 'OK'): void => {
    showDialog({
      title,
      message,
      type: 'success',
      confirmText,
    });
  };

  /**
   * Show an error dialog
   */
  const showError = (title: string, message: string | ReactNode, confirmText: string = 'OK'): void => {
    showDialog({
      title,
      message,
      type: 'error',
      confirmText,
    });
  };

  /**
   * Show a warning dialog
   */
  const showWarning = (title: string, message: string | ReactNode, confirmText: string = 'OK'): void => {
    showDialog({
      title,
      message,
      type: 'warning',
      confirmText,
    });
  };

  /**
   * Show an info dialog
   */
  const showInfo = (title: string, message: string | ReactNode, confirmText: string = 'OK'): void => {
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
  const closeDialog = (): void => {
    setIsOpen(false);
    // Reset config after a short delay to allow for exit animation
    setTimeout(() => {
      setDialogConfig(INITIAL_CONFIG);
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
