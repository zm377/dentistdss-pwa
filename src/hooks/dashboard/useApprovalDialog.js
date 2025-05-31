import { useState } from 'react';

/**
 * Custom hook for managing approval dialog state and actions
 * 
 * Features:
 * - Centralized approval dialog state management
 * - Consistent approval/rejection handling
 * - Automatic state cleanup
 * - Error handling support
 */
const useApprovalDialog = (onApprove, onReject) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Open dialog with selected item
   */
  const openDialog = (item) => {
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
  const handleApprove = async (item) => {
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
  const handleReject = async (item, reason) => {
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
  const updateRejectionReason = (reason) => {
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
