import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Surface, Button, useTheme, List, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '@homely-quad/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleIcon = () => {
    switch (user?.user_type) {
      case 'landlord':
        return '🏢';
      case 'workman':
        return '🔧';
      case 'admin':
        return '👑';
      default:
        return '🏠';
    }
  };

  const getRoleColor = () => {
    switch (user?.user_type) {
      case 'landlord':
        return '#4CAF50';
      case 'workman':
        return '#FF9800';
      case 'admin':
        return '#9C27B0';
      default:
        return '#2196F3';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <View style={styles.profileInfo}>
          <Avatar.Text 
            size={80} 
            label={getInitials(user?.first_name || '', user?.last_name || '')}
            style={[styles.avatar, { backgroundColor: theme.colors.onPrimary }]}
          />
          <Title style={[styles.userName, { color: theme.colors.onPrimary }]}>
            {user?.first_name} {user?.last_name}
          </Title>
          <View style={styles.roleContainer}>
            <Text style={[styles.roleIcon, { color: getRoleColor() }]}>
              {getRoleIcon()}
            </Text>
            <Text style={[styles.roleText, { color: theme.colors.onPrimary }]}>
              {user?.user_type?.charAt(0).toUpperCase()}{user?.user_type?.slice(1)}
            </Text>
          </View>
        </View>
      </Surface>

      <View style={styles.content}>
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader>Account Information</List.Subheader>
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Phone"
              description={user?.phone || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
            <Divider />
            <List.Item
              title="Address"
              description={user?.address || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
            <Divider />
            <List.Item
              title="Member Since"
              description={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader>Account Actions</List.Subheader>
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            <List.Item
              title="Change Password"
              description="Update your password"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            <List.Item
              title="Notifications"
              description="Manage notification preferences"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader>Support</List.Subheader>
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            <List.Item
              title="About"
              description="App version and information"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Surface>

        <Button
          mode="contained"
          onPress={logout}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          contentStyle={styles.logoutButtonContent}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;