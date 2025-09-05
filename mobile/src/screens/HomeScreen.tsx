import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, List, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@rently/shared';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'tenant': return 'Tenant';
      case 'landlord': return 'Landlord';
      case 'workman': return 'Maintenance Worker';
      default: return role;
    }
  };

  const getRoleBasedContent = () => {
    switch (user?.user_type) {
      case 'tenant':
        return {
          welcomeMessage: 'Welcome to your rental dashboard!',
          quickActions: [
            { title: 'Report Maintenance', icon: 'wrench', action: () => navigation.navigate('ReportMaintenance') },
            { title: 'View Lease', icon: 'file-document', action: () => navigation.navigate('ViewLease') },
            { title: 'Pay Rent', icon: 'credit-card', action: () => navigation.navigate('PayRent') },
            { title: 'Contact Landlord', icon: 'message', action: () => navigation.navigate('Messages') },
          ],
          recentActivity: [
            { title: 'Maintenance Request Approved', time: '2 hours ago', type: 'success' },
            { title: 'Rent Payment Due', time: '3 days', type: 'warning' },
            { title: 'Lease Renewal Available', time: '1 week', type: 'info' },
          ]
        };
      case 'landlord':
        return {
          welcomeMessage: 'Manage your properties efficiently!',
          quickActions: [
            { title: 'Add Property', icon: 'home-plus', action: () => navigation.navigate('AddProperty') },
            { title: 'View Properties', icon: 'home', action: () => navigation.navigate('ViewProperties') },
            { title: 'Maintenance Requests', icon: 'wrench', action: () => navigation.navigate('MaintenanceRequests') },
            { title: 'Tenant Messages', icon: 'message', action: () => navigation.navigate('Messages') },
          ],
          recentActivity: [
            { title: 'New Maintenance Request', time: '1 hour ago', type: 'warning' },
            { title: 'Rent Payment Received', time: '2 hours ago', type: 'success' },
            { title: 'Property Viewing Scheduled', time: 'Tomorrow', type: 'info' },
          ]
        };
      case 'workman':
        return {
          welcomeMessage: 'Manage your maintenance tasks!',
          quickActions: [
            { title: 'View Work Orders', icon: 'clipboard-list', action: () => navigation.navigate('WorkOrders') },
            { title: 'Update Status', icon: 'update', action: () => navigation.navigate('UpdateStatus') },
            { title: 'View Schedule', icon: 'calendar', action: () => navigation.navigate('Schedule') },
            { title: 'Contact Team', icon: 'message', action: () => navigation.navigate('Messages') },
          ],
          recentActivity: [
            { title: 'New Work Order Assigned', time: '30 minutes ago', type: 'warning' },
            { title: 'Task Completed', time: '2 hours ago', type: 'success' },
            { title: 'Schedule Updated', time: 'Yesterday', type: 'info' },
          ]
        };
      default:
        return {
          welcomeMessage: 'Welcome to Rently!',
          quickActions: [],
          recentActivity: []
        };
    }
  };

  const content = getRoleBasedContent();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Avatar.Text 
            size={60} 
            label={`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Title style={styles.greeting}>Hello, {user?.first_name}!</Title>
            <Paragraph style={styles.role}>{getRoleDisplayName(user?.user_type || '')}</Paragraph>
          </View>
        </View>

        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>{content.welcomeMessage}</Title>
            <Paragraph style={styles.welcomeSubtitle}>
              Here's what you can do today
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionsGrid}>
              {content.quickActions.map((action, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={action.action}
                  style={styles.actionButton}
                  icon={action.icon}
                  contentStyle={styles.actionButtonContent}
                >
                  {action.title}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.activityCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Activity</Title>
            {content.recentActivity.map((activity, index) => (
              <List.Item
                key={index}
                title={activity.title}
                description={activity.time}
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={
                      activity.type === 'success' ? 'check-circle' :
                      activity.type === 'warning' ? 'alert-circle' : 'information'
                    }
                    color={
                      activity.type === 'success' ? '#4CAF50' :
                      activity.type === 'warning' ? '#FF9800' : '#2196F3'
                    }
                  />
                )}
                right={props => (
                  <Chip 
                    style={[
                      styles.activityChip,
                      activity.type === 'success' && styles.successChip,
                      activity.type === 'warning' && styles.warningChip,
                      activity.type === 'info' && styles.infoChip,
                    ]}
                    textStyle={styles.activityChipText}
                  >
                    {activity.type}
                  </Chip>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  welcomeCard: {
    margin: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007AFF',
  },
  welcomeSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  actionsCard: {
    margin: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 10,
    borderColor: '#007AFF',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  activityCard: {
    margin: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  activityChip: {
    height: 24,
  },
  activityChipText: {
    fontSize: 10,
    color: '#ffffff',
  },
  successChip: {
    backgroundColor: '#4CAF50',
  },
  warningChip: {
    backgroundColor: '#FF9800',
  },
  infoChip: {
    backgroundColor: '#2196F3',
  },
});