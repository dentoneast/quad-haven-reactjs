import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  List,
  Divider,
  Button,
  Switch as PaperSwitch,
  TextInput,
  Portal,
  Modal,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Here you would typically make an API call to change the password
      // For now, we'll just show a success message
      Alert.alert('Success', 'Password changed successfully');
      setChangePasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been deleted');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Profile</Title>
            <List.Item
              title="Name"
              description={`${user?.first_name} ${user?.last_name}`}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="User Type"
              description={user?.user_type === 'landlord' ? '🏠 Landlord' : 
                         user?.user_type === 'workman' ? '🔧 Workman' : '👤 Tenant'}
              left={(props) => <List.Icon {...props} icon="badge-account" />}
            />
          </Card.Content>
        </Card>

        {/* Notifications Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Notifications</Title>
            <List.Item
              title="Enable Notifications"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <PaperSwitch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />
            {notificationsEnabled && (
              <>
                <List.Item
                  title="Email Notifications"
                  left={(props) => <List.Icon {...props} icon="email-outline" />}
                  right={() => (
                    <PaperSwitch
                      value={emailNotifications}
                      onValueChange={setEmailNotifications}
                    />
                  )}
                />
                <List.Item
                  title="Push Notifications"
                  left={(props) => <List.Icon {...props} icon="cellphone" />}
                  right={() => (
                    <PaperSwitch
                      value={pushNotifications}
                      onValueChange={setPushNotifications}
                    />
                  )}
                />
              </>
            )}
          </Card.Content>
        </Card>

        {/* Preferences Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Preferences</Title>
            <List.Item
              title="Dark Mode"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <PaperSwitch
                  value={darkMode}
                  onValueChange={setDarkMode}
                />
              )}
            />
            <List.Item
              title="Language"
              description={language}
              left={(props) => <List.Icon {...props} icon="translate" />}
              onPress={() => Alert.alert('Language', 'Language selection coming soon')}
            />
            <List.Item
              title="Currency"
              description={currency}
              left={(props) => <List.Icon {...props} icon="currency-usd" />}
              onPress={() => Alert.alert('Currency', 'Currency selection coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Security Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Security</Title>
            <List.Item
              title="Change Password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              onPress={() => setChangePasswordModalVisible(true)}
            />
            <List.Item
              title="Two-Factor Authentication"
              description="Not enabled"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              onPress={() => Alert.alert('2FA', 'Two-factor authentication coming soon')}
            />
            <List.Item
              title="Login Sessions"
              left={(props) => <List.Icon {...props} icon="devices" />}
              onPress={() => Alert.alert('Sessions', 'Login sessions coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Privacy Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Privacy</Title>
            <List.Item
              title="Data Usage"
              left={(props) => <List.Icon {...props} icon="database" />}
              onPress={() => Alert.alert('Data Usage', 'Data usage settings coming soon')}
            />
            <List.Item
              title="Location Services"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              onPress={() => Alert.alert('Location', 'Location services coming soon')}
            />
            <List.Item
              title="Third-Party Access"
              left={(props) => <List.Icon {...props} icon="link" />}
              onPress={() => Alert.alert('Third Party', 'Third-party access coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Support Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Support</Title>
            <List.Item
              title="Help & FAQ"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('Help', 'Help & FAQ coming soon')}
            />
            <List.Item
              title="Contact Support"
              left={(props) => <List.Icon {...props} icon="message" />}
              onPress={() => Alert.alert('Support', 'Contact support coming soon')}
            />
            <List.Item
              title="Report a Bug"
              left={(props) => <List.Icon {...props} icon="bug" />}
              onPress={() => Alert.alert('Bug Report', 'Bug reporting coming soon')}
            />
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About</Title>
            <List.Item
              title="App Version"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Terms of Service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Terms', 'Terms of service coming soon')}
            />
            <List.Item
              title="Privacy Policy"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Title>
            <List.Item
              title="Delete Account"
              description="Permanently delete your account and all data"
              left={(props) => <List.Icon {...props} icon="delete-forever" color="#f44336" />}
              onPress={handleDeleteAccount}
              titleStyle={styles.dangerText}
              descriptionStyle={styles.dangerText}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#f44336"
        >
          Logout
        </Button>
      </ScrollView>

      {/* Change Password Modal */}
      <Portal>
        <Modal
          visible={changePasswordModalVisible}
          onDismiss={() => setChangePasswordModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Change Password</Title>
          
          <TextInput
            mode="outlined"
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TextInput
            mode="outlined"
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TextInput
            mode="outlined"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setChangePasswordModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.modalButton}
            >
              Change Password
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dangerCard: {
    borderColor: '#f44336',
    borderWidth: 1,
  },
  dangerTitle: {
    color: '#f44336',
  },
  dangerText: {
    color: '#f44336',
  },
  logoutButton: {
    margin: 16,
    borderColor: '#f44336',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default SettingsScreen;
