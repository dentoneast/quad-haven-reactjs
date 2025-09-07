import { apiClient } from './client';
import { Conversation, Message } from '../types';

export class ChatService {
  // Conversations
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>('/conversations');
  }

  async getConversation(id: number): Promise<Conversation> {
    return apiClient.get<Conversation>(`/conversations/${id}`);
  }

  async createConversation(participantIds: number[], title?: string): Promise<Conversation> {
    return apiClient.post<Conversation>('/conversations', {
      participant_ids: participantIds,
      title
    });
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation> {
    return apiClient.put<Conversation>(`/conversations/${id}`, updates);
  }

  async deleteConversation(id: number): Promise<void> {
    return apiClient.delete<void>(`/conversations/${id}`);
  }

  // Messages
  async getMessages(conversationId: number): Promise<Message[]> {
    return apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: number, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    return apiClient.post<Message>(`/conversations/${conversationId}/messages`, {
      content,
      message_type: messageType
    });
  }

  async updateMessage(conversationId: number, messageId: number, content: string): Promise<Message> {
    return apiClient.put<Message>(`/conversations/${conversationId}/messages/${messageId}`, {
      content
    });
  }

  async deleteMessage(conversationId: number, messageId: number): Promise<void> {
    return apiClient.delete<void>(`/conversations/${conversationId}/messages/${messageId}`);
  }

  async markMessageAsRead(conversationId: number, messageId: number): Promise<void> {
    return apiClient.put<void>(`/conversations/${conversationId}/messages/${messageId}/read`);
  }

  async markConversationAsRead(conversationId: number): Promise<void> {
    return apiClient.put<void>(`/conversations/${conversationId}/read`);
  }
}

export const chatService = new ChatService();
