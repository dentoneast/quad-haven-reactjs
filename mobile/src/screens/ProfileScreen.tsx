import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, Avatar, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@rently/shared';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'tenant': return 'Tenant';
      case 'landlord': return 'Landlord';
      case 'workman': return 'Maintenance Worker';
      default: return role;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`}
            style={styles.avatar}
          />
          <Title style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Title>
          <Paragraph style={styles.role}>
            {getRoleDisplayName(user?.user_type || '')}
          </Paragraph>
          <Paragraph style={styles.email}>{user?.email}</Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Account Information</Title>
            <List.Item
              title="Email"
              description={user?.email}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="User Type"
              description={getRoleDisplayName(user?.user_type || '')}
              left={props => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Member Since"
              description={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.actionButton}
              icon="account-edit"
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('ChangePassword')}
              style={styles.actionButton}
              icon="lock-reset"
            >
              Change Password
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Settings')}
              style={styles.actionButton}
              icon="cog"
            >
              Settings
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              loading={isLoading}
              disabled={isLoading}
              style={styles.logoutButton}
              buttonColor="#FF3B30"
              icon="logout"
            >
              Logout
            </Button>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  name: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 5,
  },
  email: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  card: {
    margin: 15,
    marginBottom: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 10,
  },
});

