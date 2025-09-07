import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input } from '@homely-quad/shared';
import { useAuth } from '@homely-quad/shared';
import { LoginCredentials } from '@homely-quad/shared';

export default function LoginScreen() {
  const { login, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      clearError();
      await login(credentials);
    } catch (err) {
      // Error is handled by the useAuth hook
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={credentials.email}
            onChangeText={handleInputChange('email')}
            type="email"
            required
            error={error}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={credentials.password}
            onChangeText={handleInputChange('password')}
            type="password"
            required
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="Don't have an account? Sign Up"
            onPress={() => {
              // Navigate to register screen
            }}
            variant="ghost"
            style={styles.registerButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 20,
  },
  registerButton: {
    marginTop: 16,
  },
});
