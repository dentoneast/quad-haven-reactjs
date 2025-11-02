export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  propertyId: number | null;
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageData {
  recipientId: number;
  propertyId?: number;
  subject?: string;
  body: string;
}

export interface MessageWithDetails extends Message {
  sender: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  recipient: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  property?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface Conversation {
  participantId: number;
  participant: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export interface MessageFilters {
  senderId?: number;
  recipientId?: number;
  propertyId?: number;
  isRead?: boolean;
}
