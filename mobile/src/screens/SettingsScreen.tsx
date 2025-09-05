import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@rently/shared';

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

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
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Settings</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your app preferences and account
          </Paragraph>
        </View>

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            description="Receive notifications about important updates"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color="#007AFF"
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#007AFF"
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Privacy & Security</List.Subheader>
          <List.Item
            title="Location Services"
            description="Allow app to access your location for nearby properties"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                color="#007AFF"
              />
            )}
          />
          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be available soon.')}
          />
          <List.Item
            title="Terms of Service"
            description="View our terms of service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => Alert.alert('Terms of Service', 'Terms of service will be available soon.')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Change Password"
            description="Update your account password"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => navigation.navigate('EditProfile')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help Center"
            description="Get help and support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Help Center', 'Help center will be available soon.')}
          />
          <List.Item
            title="Contact Support"
            description="Get in touch with our support team"
            left={props => <List.Icon {...props} icon="email" />}
            onPress={() => Alert.alert('Contact Support', 'Contact support will be available soon.')}
          />
          <List.Item
            title="App Version"
            description="Version 1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
        </List.Section>

        <View style={styles.dangerZone}>
          <List.Section>
            <List.Subheader style={styles.dangerSubheader}>Danger Zone</List.Subheader>
            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={props => <List.Icon {...props} icon="logout" color="#FF3B30" />}
              titleStyle={styles.dangerText}
              onPress={handleLogout}
            />
            <List.Item
              title="Delete Account"
              description="Permanently delete your account"
              left={props => <List.Icon {...props} icon="delete" color="#FF3B30" />}
              titleStyle={styles.dangerText}
              onPress={handleDeleteAccount}
            />
          </List.Section>
        </View>
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
    padding: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  dangerZone: {
    marginTop: 20,
  },
  dangerSubheader: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  dangerText: {
    color: '#FF3B30',
  },
});

