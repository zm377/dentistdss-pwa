import api from './config';

const approvalAPI = {
    /**
     * Get all pending approval requests
     * @returns {Promise<Array>} List of pending approval requests
     */
    async getPendingApprovals() {
        return api.get('/api/auth/approval/pending');
    },

    /**
     * Get all approval requests for clinic admin
     * @returns {Promise<Array>} List of all approval requests for clinic admin
     */
    async getPendingApprovalsForClinicAdmin(clinicId) {
        return api.get(`/api/auth/approval/clinic/${clinicId}/pending`);
    },

    /**
     * Review an approval request (approve or reject)
     * @param {number|string} requestId - The ID of the approval request to review
     * @param {boolean} approved - Whether to approve (true) or reject (false) the request
     * @param {string} reviewNotes - Notes explaining the decision
     * @returns {Promise<Object>} Response from the API
     */
    async reviewApproval(requestId, approved, reviewNotes) {
        return api.post(`/api/auth/approval/${requestId}/review`, {
            approved,
            reviewNotes
        });
    }
};

export default approvalAPI;
