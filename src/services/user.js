import api from './config';

const userAPI = {

    /**
     * Get all users
     * @returns {Promise<Object>} All users
     */
    async getAllUsers() {
        return api.get(`/api/auth/user/list/all`);
    },
    /**
     * Get user profile
     * @param {string} userId - The ID of the user to fetch
     * @returns {Promise<Object>} User profile
     */
    async getProfile(userId) {
        return api.get(`/api/auth/user/${userId}/details`);
    },

    /**
     * Update user profile
     * @param {string} userId - The ID of the user to update
     * @param {Object} updates - The updates to apply to the user
     * @returns {Promise<Object>} Updated user profile
     */
    async updateProfile(userId, updates) {
        return api.put(`/api/auth/user/${userId}`, updates);
    },
};

export default userAPI;