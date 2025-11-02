import type {
  Message,
  MessageWithDetails,
  CreateMessageData,
  Conversation,
  MessageFilters,
} from '../types';
import { getApiClient } from './client';

export const messagesApi = {
  async getAll(filters?: MessageFilters): Promise<Message[]> {
    const client = getApiClient();
    return client.get<Message[]>('/messages', filters);
  },

  async getById(id: number): Promise<MessageWithDetails> {
    const client = getApiClient();
    return client.get<MessageWithDetails>(`/messages/${id}`);
  },

  async getConversations(): Promise<Conversation[]> {
    const client = getApiClient();
    return client.get<Conversation[]>('/messages/conversations');
  },

  async getConversationWith(userId: number): Promise<MessageWithDetails[]> {
    const client = getApiClient();
    return client.get<MessageWithDetails[]>(`/messages/conversation/${userId}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const client = getApiClient();
    return client.get<{ count: number }>('/messages/unread/count');
  },

  async send(data: CreateMessageData): Promise<Message> {
    const client = getApiClient();
    return client.post<Message>('/messages', data);
  },

  async markAsRead(id: number): Promise<Message> {
    const client = getApiClient();
    return client.patch<Message>(`/messages/${id}/read`);
  },

  async markAllAsRead(senderId: number): Promise<{ count: number }> {
    const client = getApiClient();
    return client.post<{ count: number }>(`/messages/read-all/${senderId}`);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/messages/${id}`);
  },
};
