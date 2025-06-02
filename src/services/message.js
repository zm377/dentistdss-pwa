import api from './config';

const messageAPI = {
    async getMessages(userId) {
        return api.get(`/api/notification/user/${userId}`);
    },

    async getUnreadMessagesCount(userId) {
        return api.get(`/api/notification/user/${userId}/unread-count`);
    },

    async markAsRead(messageId) {
        return api.put(`/api/notification/${messageId}/read`);
    },
};

export default messageAPI;