import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  Title,
  Surface,
  TextInput,
  Button,
  useTheme,
  Avatar,
  Chip,
  Divider,
  List,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  message_type: string;
  content: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_first_name: string;
  sender_last_name: string;
  sender_user_type: string;
}

interface Conversation {
  id: number;
  conversation_type: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Participant {
  id: number;
  user_id: number;
  role: string;
  is_active: boolean;
  joined_at: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { conversationId } = route.params as { conversationId: number };
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadConversation();
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadConversation = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/conversations/${conversationId}`);
      // setConversation(response.data.conversation);
      // setParticipants(response.data.participants);
      
      // Mock data for now
      setConversation({
        id: conversationId,
        conversation_type: 'lease_related',
        title: 'Lease Discussion - Unit A101',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z',
      });
      
      setParticipants([
        {
          id: 1,
          user_id: 1,
          role: 'tenant',
          is_active: true,
          joined_at: '2024-01-15T10:00:00Z',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          user_type: 'tenant',
        },
        {
          id: 2,
          user_id: 2,
          role: 'landlord',
          is_active: true,
          joined_at: '2024-01-15T10:00:00Z',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          user_type: 'landlord',
        },
      ]);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      Alert.alert('Error', 'Failed to load conversation details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/conversations/${conversationId}/messages`);
      // setMessages(response.data.messages);
      
      // Mock data for now
      setMessages([
        {
          id: 1,
          conversation_id: conversationId,
          sender_id: 1,
          message_type: 'text',
          content: 'Hi, I have a question about the lease renewal. When does my current lease expire?',
          is_read: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          sender_first_name: 'John',
          sender_last_name: 'Doe',
          sender_user_type: 'tenant',
        },
        {
          id: 2,
          conversation_id: conversationId,
          sender_id: 2,
          message_type: 'text',
          content: 'Hi John! Your lease expires on December 31st, 2024. Would you like to discuss renewal options?',
          is_read: true,
          created_at: '2024-01-15T10:15:00Z',
          updated_at: '2024-01-15T10:15:00Z',
          sender_first_name: 'Jane',
          sender_last_name: 'Smith',
          sender_user_type: 'landlord',
        },
        {
          id: 3,
          conversation_id: conversationId,
          sender_id: 1,
          message_type: 'text',
          content: 'Yes, I would like to renew. Can we discuss the terms and any potential rent increase?',
          is_read: false,
          created_at: '2024-01-15T14:30:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          sender_first_name: 'John',
          sender_last_name: 'Doe',
          sender_user_type: 'tenant',
        },
      ]);
    } catch (error) {
      console.error('Failed to load messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post(`/conversations/${conversationId}/messages`, {
      //   content: newMessage.trim(),
      //   message_type: 'text'
      // });
      
      // Mock success - add message locally
      const mockMessage: Message = {
        id: Date.now(),
        conversation_id: conversationId,
        sender_id: user?.id || 0,
        message_type: 'text',
        content: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_first_name: user?.first_name || '',
        sender_last_name: user?.last_name || '',
        sender_user_type: user?.user_type || 'tenant',
      };
      
      setMessages(prev => [...prev, mockMessage]);
      setNewMessage('');
      
      // Update conversation timestamp
      if (conversation) {
        setConversation(prev => prev ? { ...prev, updated_at: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConversationTypeIcon = (type: string) => {
    switch (type) {
      case 'lease_related': return 'file-document';
      case 'maintenance': return 'wrench';
      case 'payment': return 'credit-card';
      default: return 'chat';
    }
  };

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case 'lease_related': return '#2196f3';
      case 'maintenance': return '#ff9800';
      case 'payment': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getConversationTypeLabel = (type: string) => {
    switch (type) {
      case 'lease_related': return 'Lease Related';
      case 'maintenance': return 'Maintenance';
      case 'payment': return 'Payment';
      default: return 'General';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading conversation...</Text>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text>Conversation not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.conversationInfo}>
            <Title style={styles.conversationTitle}>{conversation.title}</Title>
            <Chip
              mode="outlined"
              textStyle={{ color: getConversationTypeColor(conversation.conversation_type) }}
              style={styles.typeChip}
            >
              {getConversationTypeLabel(conversation.conversation_type)}
            </Chip>
          </View>
          <MaterialCommunityIcons
            name={getConversationTypeIcon(conversation.conversation_type)}
            size={24}
            color={getConversationTypeColor(conversation.conversation_type)}
          />
        </View>
        
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsLabel}>Participants:</Text>
          {participants.map((participant) => (
            <Chip
              key={participant.id}
              mode="outlined"
              style={styles.participantChip}
              textStyle={{ fontSize: 12 }}
            >
              {participant.first_name} ({participant.user_type})
            </Chip>
          ))}
        </View>
      </Surface>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === user?.id;
          
          return (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
              ]}
            >
              {!isOwnMessage && (
                <View style={styles.messageHeader}>
                  <Avatar.Text
                    size={24}
                    label={`${message.sender_first_name[0]}${message.sender_last_name[0]}`}
                    style={styles.avatar}
                  />
                  <Text style={styles.senderName}>
                    {message.sender_first_name} {message.sender_last_name}
                  </Text>
                  <Chip mode="outlined" style={styles.roleChip} textStyle={{ fontSize: 10 }}>
                    {message.sender_user_type}
                  </Chip>
                </View>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                ]}>
                  {message.content}
                </Text>
                <Text style={[
                  styles.messageTime,
                  isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
                ]}>
                  {formatMessageTime(message.created_at)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Surface style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            style={styles.textInput}
            multiline
            maxLength={1000}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
              />
            }
          />
        </View>
        <Text style={styles.characterCount}>
          {newMessage.length}/1000
        </Text>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conversationInfo: {
    flex: 1,
    marginRight: 12,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  participantsLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginRight: 8,
  },
  participantChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  roleChip: {
    height: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.7,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherMessageTime: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  characterCount: {
    fontSize: 10,
    opacity: 0.6,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default ChatScreen; 