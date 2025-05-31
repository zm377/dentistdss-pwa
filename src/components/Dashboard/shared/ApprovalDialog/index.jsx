import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

/**
 * ApprovalDialog - A reusable dialog for approval/rejection workflows
 * 
 * Features:
 * - Flexible content rendering through render prop
 * - Built-in rejection reason input
 * - Consistent approval/rejection actions
 * - Proper accessibility attributes
 */
const ApprovalDialog = ({
  open,
  onClose,
  selectedItem,
  rejectionReason = '',
  onRejectionReasonChange,
  onApprove,
  onReject,
  title = 'Review Request',
  renderItemDetails,
  approveText = 'Approve',
  rejectText = 'Reject',
  cancelText = 'Cancel',
  rejectionReasonLabel = 'Reason for Rejection (if any)',
  disabled = false,
  ...otherProps
}) => {
  if (!selectedItem) return null;

  const handleApprove = () => {
    onApprove(selectedItem);
  };

  const handleReject = () => {
    onReject(selectedItem, rejectionReason);
  };

  const handleRejectionReasonChange = (event) => {
    onRejectionReasonChange(event.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="approval-dialog-title"
      {...otherProps}
    >
      <DialogTitle id="approval-dialog-title">
        {title}
      </DialogTitle>
      
      <DialogContent>
        {/* Render item details */}
        {renderItemDetails && (
          <Box sx={{ mb: 2 }}>
            {renderItemDetails(selectedItem)}
          </Box>
        )}
        
        {/* Rejection reason input */}
        <TextField
          autoFocus
          margin="dense"
          id={`rejectionReason-${selectedItem.id}`}
          label={rejectionReasonLabel}
          type="text"
          fullWidth
          variant="standard"
          value={rejectionReason}
          onChange={handleRejectionReasonChange}
          multiline
          rows={2}
          sx={{ mt: 2 }}
          placeholder="Optional: Provide a reason for rejection"
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={disabled}
        >
          {cancelText}
        </Button>
        
        <Button 
          onClick={handleReject} 
          color="error" 
          variant="outlined"
          disabled={!selectedItem || disabled}
        >
          {rejectText}
        </Button>
        
        <Button 
          onClick={handleApprove} 
          color="primary" 
          variant="contained"
          disabled={!selectedItem || disabled}
        >
          {approveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ApprovalDialog.propTypes = {
  /** Whether the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Function to close the dialog */
  onClose: PropTypes.func.isRequired,
  /** The item being reviewed */
  selectedItem: PropTypes.object,
  /** Current rejection reason text */
  rejectionReason: PropTypes.string,
  /** Function to handle rejection reason changes */
  onRejectionReasonChange: PropTypes.func.isRequired,
  /** Function to handle approval */
  onApprove: PropTypes.func.isRequired,
  /** Function to handle rejection */
  onReject: PropTypes.func.isRequired,
  /** Dialog title */
  title: PropTypes.string,
  /** Function to render item details - receives (item) */
  renderItemDetails: PropTypes.func,
  /** Text for approve button */
  approveText: PropTypes.string,
  /** Text for reject button */
  rejectText: PropTypes.string,
  /** Text for cancel button */
  cancelText: PropTypes.string,
  /** Label for rejection reason field */
  rejectionReasonLabel: PropTypes.string,
  /** Whether actions are disabled */
  disabled: PropTypes.bool,
};

export default ApprovalDialog;
