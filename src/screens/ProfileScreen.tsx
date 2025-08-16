import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  Surface,
  Avatar,
  Divider,
  List,
  Switch,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const theme = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        dateOfBirth: user.date_of_birth || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const updateProfileField = (key: string, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const updatePasswordField = (key: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        first_name: profileData.firstName.trim(),
        last_name: profileData.lastName.trim(),
        phone: profileData.phone.trim() || undefined,
        date_of_birth: profileData.dateOfBirth || undefined,
        address: profileData.address.trim() || undefined,
      });
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh user data if needed
    setRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.header}>
        <Avatar.Text
          size={80}
          label={`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}
          style={styles.avatar}
        />
        <Title style={styles.name}>{`${user.first_name} ${user.last_name}`}</Title>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.userType}>
          {user.user_type === 'landlord' ? '🏠 Landlord' : 
           user.user_type === 'admin' ? '👑 Admin' : 
           user.user_type === 'workman' ? '🔧 Workman' : '👤 Tenant'}
        </Text>
        {user.is_verified && (
          <Text style={styles.verified}>✓ Verified Account</Text>
        )}
      </Surface>

      <Surface style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Profile Information</Title>
          <Button
            mode={isEditing ? 'outlined' : 'contained'}
            onPress={() => setIsEditing(!isEditing)}
            compact
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </View>

        {isEditing ? (
          <View>
            <TextInput
              label="First Name"
              value={profileData.firstName}
              onChangeText={(value) => updateProfileField('firstName', value)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Last Name"
              value={profileData.lastName}
              onChangeText={(value) => updateProfileField('lastName', value)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Phone"
              value={profileData.phone}
              onChangeText={(value) => updateProfileField('phone', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              label="Date of Birth"
              value={profileData.dateOfBirth}
              onChangeText={(value) => updateProfileField('dateOfBirth', value)}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />
            <TextInput
              label="Address"
              value={profileData.address}
              onChangeText={(value) => updateProfileField('address', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
            />
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </View>
        ) : (
          <View>
            <List.Item
              title="First Name"
              description={user.first_name}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Last Name"
              description={user.last_name}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Phone"
              description={user.phone || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
            <List.Item
              title="Date of Birth"
              description={user.date_of_birth || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
            <List.Item
              title="Address"
              description={user.address || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
            <List.Item
              title="Member Since"
              description={new Date(user.created_at).toLocaleDateString()}
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
            />
          </View>
        )}
      </Surface>

      <Surface style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Security</Title>
          <Button
            mode={isChangingPassword ? 'outlined' : 'contained'}
            onPress={() => setIsChangingPassword(!isChangingPassword)}
            compact
          >
            {isChangingPassword ? 'Cancel' : 'Change Password'}
          </Button>
        </View>

        {isChangingPassword && (
          <View>
            <TextInput
              label="Current Password"
              value={passwordData.currentPassword}
              onChangeText={(value) => updatePasswordField('currentPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              label="New Password"
              value={passwordData.newPassword}
              onChangeText={(value) => updatePasswordField('newPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChangeText={(value) => updatePasswordField('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </View>
        )}
      </Surface>

      <Surface style={styles.section}>
        <Title style={styles.sectionTitle}>Account Actions</Title>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.button}
          icon="logout"
        >
          Logout
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  userType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#f3e5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  verified: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ProfileScreen; 