import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Card, Title, Paragraph, Avatar, Badge, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@rently/shared';

export default function MessagesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [messages] = useState([
    {
      id: '1',
      senderName: 'John Smith',
      senderRole: 'Landlord',
      lastMessage: 'The maintenance request has been approved. We\'ll send someone tomorrow.',
      timestamp: '2 hours ago',
      unreadCount: 2,
      avatar: 'JS',
    },
    {
      id: '2',
      senderName: 'Sarah Johnson',
      senderRole: 'Tenant',
      lastMessage: 'Thank you for the quick response!',
      timestamp: '1 day ago',
      unreadCount: 0,
      avatar: 'SJ',
    },
    {
      id: '3',
      senderName: 'Mike Wilson',
      senderRole: 'Maintenance',
      lastMessage: 'I\'ve completed the repair. Please let me know if you need anything else.',
      timestamp: '3 days ago',
      unreadCount: 1,
      avatar: 'MW',
    },
  ]);

  const renderMessage = ({ item }: any) => (
    <Card 
      style={styles.messageCard}
      onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
    >
      <Card.Content style={styles.messageContent}>
        <Avatar.Text 
          size={50} 
          label={item.avatar}
          style={styles.avatar}
        />
        <View style={styles.messageInfo}>
          <View style={styles.messageHeader}>
            <Title style={styles.senderName}>{item.senderName}</Title>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Paragraph style={styles.senderRole}>{item.senderRole}</Paragraph>
          <Paragraph style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Paragraph>
        </View>
        {item.unreadCount > 0 && (
          <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Messages</Title>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>💬</Text>
          <Title style={styles.emptyStateTitle}>No Messages Yet</Title>
          <Paragraph style={styles.emptyStateText}>
            Start a conversation with your {user?.user_type === 'tenant' ? 'landlord or maintenance team' : 
            user?.user_type === 'landlord' ? 'tenants or maintenance team' : 'tenants or landlords'}.
          </Paragraph>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NewMessage')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  messagesList: {
    padding: 15,
  },
  messageCard: {
    marginBottom: 10,
    elevation: 2,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
    backgroundColor: '#007AFF',
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  senderRole: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});

