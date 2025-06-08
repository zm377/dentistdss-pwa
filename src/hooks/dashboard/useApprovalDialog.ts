import { useState } from 'react';

type ApprovalHandler<T> = (item: T, reason: string) => Promise<void>;

interface DialogProps<T> {
  open: boolean;
  onClose: () => void;
  selectedItem: T | null;
  rejectionReason: string;
  onRejectionReasonChange: (reason: string) => void;
  onApprove: (item: T) => Promise<void>;
  onReject: (item: T, reason: string) => Promise<void>;
  disabled: boolean;
}

interface UseApprovalDialogReturn<T> {
  isOpen: boolean;
  selectedItem: T | null;
  rejectionReason: string;
  isLoading: boolean;
  openDialog: (item: T) => void;
  closeDialog: () => void;
  handleApprove: (item: T) => Promise<void>;
  handleReject: (item: T, reason: string) => Promise<void>;
  updateRejectionReason: (reason: string) => void;
  dialogProps: DialogProps<T>;
}

/**
 * Custom hook for managing approval dialog state and actions
 *
 * Features:
 * - Centralized approval dialog state management
 * - Consistent approval/rejection handling
 * - Automatic state cleanup
 * - Error handling support
 */
const useApprovalDialog = <T = any>(
  onApprove?: ApprovalHandler<T>,
  onReject?: ApprovalHandler<T>
): UseApprovalDialogReturn<T> => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Open dialog with selected item
   */
  const openDialog = (item: T): void => {
    setSelectedItem(item);
    setIsOpen(true);
    setRejectionReason('');
  };

  /**
   * Close dialog and reset state
   */
  const closeDialog = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setRejectionReason('');
    setIsLoading(false);
  };

  /**
   * Handle approval action
   */
  const handleApprove = async (item: T): Promise<void> => {
    if (!item || !onApprove) return;
    
    setIsLoading(true);
    try {
      await onApprove(item, rejectionReason || 'Approved');
      closeDialog();
    } catch (error) {
      console.error('Error approving item:', error);
      // Keep dialog open on error so user can retry
      setIsLoading(false);
      throw error; // Re-throw for component to handle
    }
  };

  /**
   * Handle rejection action
   */
  const handleReject = async (item: T, reason: string): Promise<void> => {
    if (!item || !onReject) return;
    
    setIsLoading(true);
    try {
      await onReject(item, reason || 'Rejected');
      closeDialog();
    } catch (error) {
      console.error('Error rejecting item:', error);
      // Keep dialog open on error so user can retry
      setIsLoading(false);
      throw error; // Re-throw for component to handle
    }
  };

  /**
   * Update rejection reason
   */
  const updateRejectionReason = (reason: string): void => {
    setRejectionReason(reason);
  };

  return {
    // State
    isOpen,
    selectedItem,
    rejectionReason,
    isLoading,
    
    // Actions
    openDialog,
    closeDialog,
    handleApprove,
    handleReject,
    updateRejectionReason,
    
    // Convenience props for ApprovalDialog
    dialogProps: {
      open: isOpen,
      onClose: closeDialog,
      selectedItem,
      rejectionReason,
      onRejectionReasonChange: updateRejectionReason,
      onApprove: handleApprove,
      onReject: handleReject,
      disabled: isLoading,
    },
  };
};

export default useApprovalDialog;
