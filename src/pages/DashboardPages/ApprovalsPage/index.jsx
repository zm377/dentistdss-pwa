import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ListItem,
  Button,
  Alert,
  DialogContentText,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import { useAsyncData } from '../../../hooks/dashboard/useAsyncData';
import {
  ListCard,
  ApprovalDialog
} from '../../../components/Dashboard/shared';
import useApprovalDialog from '../../../hooks/dashboard/useApprovalDialog';
import useConfirmationDialog from '../../../hooks/dashboard/useConfirmationDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import {
  mockPendingApprovalsData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';
import {
  formatDate
} from '../../../utils/dashboard/dashboardUtils';
import api from '../../../services';

/**
 * ApprovalsPage - Unified approvals page for admin roles
 *
 * Features:
 * - System-wide approvals for System Admin
 * - Clinic-specific approvals for Clinic Admin
 * - Approval workflow management
 */
const ApprovalsPage = ({ userRole = 'SYSTEM_ADMIN', clinicId = null }) => {
  const { currentUser } = useAuth() || {};

  // Confirmation dialog management
  const confirmationDialog = useConfirmationDialog();

  // Data fetching function
  const fetchApprovals = useCallback(async () => {
    let data;
    if (userRole === 'SYSTEM_ADMIN') {
      // Load all pending approvals
      data = await api.approval.getPendingApprovals();
    } else if (userRole === 'CLINIC_ADMIN') {
      // Load clinic-specific approvals
      data = await api.approval.getPendingApprovalsForClinicAdmin(clinicId);
    } else {
      // Fallback to mock data
      data = await simulateApiCall(mockPendingApprovalsData);
    }
    return data;
  }, [userRole, clinicId]);

  // Use async data hook
  const {
    data: pendingApprovals = [],
    loading,
    error,
    refresh: refreshApprovals,
    setData: setPendingApprovals,
  } = useAsyncData(fetchApprovals, [userRole, clinicId], {
    onError: (err) => {
      console.error('Failed to load approvals:', err);
      // Fallback to mock data on error
      return simulateApiCall(mockPendingApprovalsData);
    },
  });

  // Approval dialog management
  const approvalDialog = useApprovalDialog(
    // onApprove
    async (approval, reason) => {
      try {
        await api.approval.reviewApproval(approval.id, true, reason || 'Approved');
        setPendingApprovals(prev => prev.filter(item => item.id !== approval.id));
        confirmationDialog.showSuccess(
          'Approval Successful',
          `${approval.requestedRole || approval.type} for ${approval.userName} has been approved.`
        );
      } catch (error) {
        console.error('Error approving request:', error);
        confirmationDialog.showError(
          'Approval Failed',
          `Failed to approve request: ${error.message}`
        );
        throw error;
      }
    },
    // onReject
    async (approval, reason) => {
      try {
        await api.approval.reviewApproval(approval.id, false, reason || 'Rejected');
        setPendingApprovals(prev => prev.filter(item => item.id !== approval.id));
        confirmationDialog.showWarning(
          'Request Rejected',
          `${approval.requestedRole || approval.type} for ${approval.userName} has been rejected.`
        );
      } catch (error) {
        console.error('Error rejecting request:', error);
        confirmationDialog.showError(
          'Rejection Failed',
          `Failed to reject request: ${error.message}`
        );
        throw error;
      }
    }
  );



  /**
   * Render individual approval item
   */
  const renderApprovalItem = (approval, index) => (
    <ListItem key={approval.id || index}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 1 }}>
          {`${approval.requestedRole || approval.type} - ${approval.userName}`}
        </Box>
        <Box sx={{ mt: 1 }}>
          {approval.userEmail && (
            <Box sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
              Email: {approval.userEmail}
            </Box>
          )}
          {approval.clinicName && (
            <Box sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
              Clinic: {approval.clinicName}
            </Box>
          )}
          <Box sx={{ mb: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
            Submitted: {formatDate(approval.createdAt)}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: { xs: 1, sm: 0 } }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => approvalDialog.openDialog(approval)}
        >
          Review
        </Button>
      </Box>
    </ListItem>
  );

  /**
   * Render approval dialog details
   */
  const renderApprovalDialogDetails = (item) => (
    <DialogContentText>
      <strong>Type:</strong> {item.requestedRole || item.type}<br />
      <strong>User:</strong> {item.userName}<br />
      {item.userEmail && <><strong>Email:</strong> {item.userEmail}<br /></>}
      {item.clinicName && <><strong>Clinic:</strong> {item.clinicName}<br /></>}
      {item.requestReason && <><strong>Request Reason:</strong> {item.requestReason}<br /></>}
      <strong>Submitted:</strong> {formatDate(item.createdAt)}
    </DialogContentText>
  );

  /**
   * Get role-specific title
   */
  const getDialogTitle = () => {
    switch (userRole) {
      case 'SYSTEM_ADMIN':
        return 'Review Approval Request';
      case 'CLINIC_ADMIN':
        return 'Review Staff Signup Request';
      default:
        return 'Review Request';
    }
  };

  if (loading) {
    return <Alert severity="info">Loading approvals...</Alert>;
  }

  if (error) {
    return <Alert severity="error">Failed to load approvals. Please try again later.</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <ListCard
        items={pendingApprovals}
        renderItem={renderApprovalItem}
        emptyMessage="No pending approvals."
      />

      {/* Approval Dialog */}
      <ApprovalDialog
        {...approvalDialog.dialogProps}
        title={getDialogTitle()}
        renderItemDetails={renderApprovalDialogDetails}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationDialog.dialogProps} />
    </Box>
  );
};

ApprovalsPage.propTypes = {
  /** User role to determine approval scope */
  userRole: PropTypes.oneOf(['SYSTEM_ADMIN', 'CLINIC_ADMIN']),
  /** Clinic ID for filtering approvals (Clinic Admin only) */
  clinicId: PropTypes.string,
};

export default ApprovalsPage;
