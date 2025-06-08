import api from './config';

interface ApprovalRequest {
  id: number;
  userId: number;
  clinicId?: number;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  reviewNotes?: string;
}

const approvalAPI = {
    /**
     * Get all pending approval requests
     * @returns List of pending approval requests
     */
    async getPendingApprovals(): Promise<ApprovalRequest[]> {
        return api.get('/api/auth/approval/pending');
    },

    /**
     * Get all approval requests for clinic admin
     * @returns List of all approval requests for clinic admin
     */
    async getPendingApprovalsForClinicAdmin(clinicId: number): Promise<ApprovalRequest[]> {
        return api.get(`/api/auth/approval/clinic/${clinicId}/pending`);
    },

    /**
     * Review an approval request (approve or reject)
     * @param requestId - The ID of the approval request to review
     * @param approved - Whether to approve (true) or reject (false) the request
     * @param reviewNotes - Notes explaining the decision
     * @returns Response from the API
     */
    async reviewApproval(requestId: number, approved: boolean, reviewNotes: string): Promise<ApprovalRequest> {
        return api.post(`/api/auth/approval/${requestId}/review`, {
            approved,
            reviewNotes
        });
    }
};

export default approvalAPI;
