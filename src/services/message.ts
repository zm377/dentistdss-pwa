import api from './config';
import { Message, UnreadCountResponse } from '../types';

const messageAPI = {
    async getMessages(userId: number): Promise<Message[]> {
        return api.get(`/api/notification/user/${userId}`);
    },

    async getUnreadMessagesCount(userId: number): Promise<UnreadCountResponse> {
        return api.get(`/api/notification/user/${userId}/unread-count`);
    },

    async markAsRead(messageId: number): Promise<void> {
        return api.put(`/api/notification/${messageId}/read`);
    },
};

export default messageAPI;