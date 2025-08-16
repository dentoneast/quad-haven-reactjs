import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Title,
  Surface,
  Card,
  Chip,
  useTheme,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  List,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface Conversation {
  id: number;
  conversation_type: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_at?: string;
  last_message_content?: string;
  last_message_sender?: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_type: string;
  email: string;
}

const ConversationsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  const [newConversation, setNewConversation] = useState({
    title: '',
    conversation_type: 'general',
    participant_ids: [] as number[],
    initial_message: '',
  });

  const conversationTypes = [
    { value: 'general', label: 'General', icon: 'chat' },
    { value: 'lease_related', label: 'Lease Related', icon: 'file-document' },
    { value: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { value: 'payment', label: 'Payment', icon: 'credit-card' },
  ];

  useEffect(() => {
    loadConversations();
    loadAvailableUsers();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/conversations');
      // setConversations(response.data.conversations);
      
      // Mock data for now
      setConversations([
        {
          id: 1,
          conversation_type: 'lease_related',
          title: 'Lease Discussion - Unit A101',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          message_count: 3,
          last_message_at: '2024-01-15T14:30:00Z',
          last_message_content: 'Yes, I would like to renew. Can we discuss the terms and any potential rent increase?',
          last_message_sender: 'John',
        },
        {
          id: 2,
          conversation_type: 'maintenance',
          title: 'Maintenance Request - Leaky Faucet',
          created_at: '2024-01-16T09:00:00Z',
          updated_at: '2024-01-16T11:15:00Z',
          message_count: 2,
          last_message_at: '2024-01-16T11:15:00Z',
          last_message_content: 'Yes, I\'ve notified the maintenance team. They should be there tomorrow between 9 AM and 12 PM.',
          last_message_sender: 'Jane',
        },
        {
          id: 3,
          conversation_type: 'payment',
          title: 'Rent Payment Discussion',
          created_at: '2024-01-17T08:00:00Z',
          updated_at: '2024-01-17T08:45:00Z',
          message_count: 2,
          last_message_at: '2024-01-17T08:45:00Z',
          last_message_content: 'Of course! What specific issue are you encountering? I can walk you through the process.',
          last_message_sender: 'Jane',
        },
      ]);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      // TODO: Replace with actual API call to get users in the same organization
      // const response = await api.get('/users');
      // setAvailableUsers(response.data.users);
      
      // Mock data for now
      setAvailableUsers([
        { id: 1, first_name: 'John', last_name: 'Doe', user_type: 'tenant', email: 'john.doe@example.com' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', user_type: 'landlord', email: 'jane.smith@example.com' },
        { id: 3, first_name: 'Mike', last_name: 'Johnson', user_type: 'tenant', email: 'mike.johnson@example.com' },
        { id: 4, first_name: 'Sarah', last_name: 'Wilson', user_type: 'landlord', email: 'sarah.wilson@example.com' },
      ]);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const filterConversations = () => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conversation =>
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.last_message_content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  const getConversationTypeIcon = (type: string): string => {
    const typeInfo = conversationTypes.find(t => t.value === type);
    return typeInfo?.icon || 'chat';
  };

  const getConversationTypeLabel = (type: string) => {
    const typeInfo = conversationTypes.find(t => t.value === type);
    return typeInfo?.label || 'General';
  };

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case 'lease_related': return '#2196f3';
      case 'maintenance': return '#ff9800';
      case 'payment': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleCreateConversation = async () => {
    if (!newConversation.title.trim() || newConversation.participant_ids.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/conversations', newConversation);
      // await loadConversations();
      
      // Mock success
      setModalVisible(false);
      setNewConversation({
        title: '',
        conversation_type: 'general',
        participant_ids: [],
        initial_message: '',
      });
      await loadConversations();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleParticipant = (userId: number) => {
    setNewConversation(prev => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(userId)
        ? prev.participant_ids.filter(id => id !== userId)
        : [...prev.participant_ids, userId]
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const navigateToChat = (conversationId: number) => {
            navigation.navigate('Chat' as any, { conversationId } as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <Title style={styles.title}>Messages</Title>
          <Text style={styles.subtitle}>
            Chat with landlords, tenants, and property managers
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search conversations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            onPress={() => navigateToChat(conversation.id)}
            style={styles.conversationTouchable}
          >
            <Card style={styles.conversationCard}>
              <Card.Content>
                <View style={styles.conversationHeader}>
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

                {conversation.last_message_content && (
                  <View style={styles.lastMessageContainer}>
                    <Text style={styles.lastMessageSender}>
                      {conversation.last_message_sender}:
                    </Text>
                    <Text style={styles.lastMessageContent} numberOfLines={2}>
                      {conversation.last_message_content}
                    </Text>
                  </View>
                )}

                <View style={styles.conversationFooter}>
                  <Text style={styles.messageCount}>
                    {conversation.message_count} message{conversation.message_count !== 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.lastMessageTime}>
                    {formatLastMessageTime(conversation.last_message_at)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {filteredConversations.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="chat" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Conversations</Title>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No conversations match your search.' : 'Start a conversation to get in touch with others.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Start New Conversation</Title>

            <TextInput
              label="Conversation Title *"
              value={newConversation.title}
              onChangeText={(text) => setNewConversation(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Conversation Type"
              value={newConversation.conversation_type}
              onChangeText={(text) => setNewConversation(prev => ({ ...prev, conversation_type: text }))}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Select Participants</Text>
            {availableUsers
              .filter(u => u.id !== user?.id)
              .map((participant) => (
                <List.Item
                  key={participant.id}
                  title={`${participant.first_name} ${participant.last_name}`}
                  description={`${participant.user_type} • ${participant.email}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={newConversation.participant_ids.includes(participant.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    />
                  )}
                  onPress={() => toggleParticipant(participant.id)}
                  style={styles.participantItem}
                />
              ))}

            <TextInput
              label="Initial Message (Optional)"
              value={newConversation.initial_message}
              onChangeText={(text) => setNewConversation(prev => ({ ...prev, initial_message: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Start the conversation with a message..."
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateConversation}
                style={styles.modalButton}
                loading={isLoading}
                disabled={isLoading || !newConversation.title.trim() || newConversation.participant_ids.length === 0}
              >
                Create
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  conversationTouchable: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  conversationCard: {
    marginBottom: 8,
  },
  conversationHeader: {
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  lastMessageContainer: {
    marginBottom: 12,
  },
  lastMessageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  lastMessageContent: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  lastMessageTime: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  emptyState: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  participantItem: {
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ConversationsScreen; 