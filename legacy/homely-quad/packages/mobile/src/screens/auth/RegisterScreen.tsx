import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  Surface,
  useTheme,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { useAuth } from '@homely-quad/shared';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    userType: 'tenant',
  });

  const [organizationData, setOrganizationData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  const isLandlord = formData.userType === 'landlord';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrganizationChange = (field: string, value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim() || 
        !formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (isLandlord) {
      if (!organizationData.name.trim() || !organizationData.email.trim()) {
        Alert.alert('Error', 'Please fill in organization details');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registerData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address.trim() || undefined,
      };

      await register(registerData);
      // Navigation will be handled by the auth state change
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.surface} elevation={3}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>
            Create Account
          </Title>
          <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
            Join our rental management platform
          </Text>

          <View style={styles.form}>
            {/* User Type Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                I am a:
              </Text>
              <SegmentedButtons
                value={formData.userType}
                onValueChange={(value) => handleInputChange('userType', value)}
                buttons={[
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'landlord', label: 'Landlord' },
                  { value: 'workman', label: 'Workman' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Basic Information
              </Text>
              
              <View style={styles.row}>
                <TextInput
                  label="First Name *"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  left={<TextInput.Icon icon="account" />}
                />
                <TextInput
                  label="Last Name *"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                />
              </View>

              <TextInput
                label="Email *"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />

              <TextInput
                label="Password *"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirm Password *"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />

              <TextInput
                label="Address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
              />
            </View>

            {/* Organization Information for Landlords */}
            {isLandlord && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Organization Information
                  </Text>

                  <TextInput
                    label="Organization Name *"
                    value={organizationData.name}
                    onChangeText={(value) => handleOrganizationChange('name', value)}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="office-building" />}
                  />

                  <TextInput
                    label="Organization Email *"
                    value={organizationData.email}
                    onChangeText={(value) => handleOrganizationChange('email', value)}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                  />

                  <View style={styles.row}>
                    <TextInput
                      label="City"
                      value={organizationData.city}
                      onChangeText={(value) => handleOrganizationChange('city', value)}
                      mode="outlined"
                      style={[styles.input, styles.halfInput]}
                      left={<TextInput.Icon icon="city" />}
                    />
                    <TextInput
                      label="State"
                      value={organizationData.state}
                      onChangeText={(value) => handleOrganizationChange('state', value)}
                      mode="outlined"
                      style={[styles.input, styles.halfInput]}
                    />
                  </View>

                  <TextInput
                    label="Organization Description"
                    value={organizationData.description}
                    onChangeText={(value) => handleOrganizationChange('description', value)}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    left={<TextInput.Icon icon="text" />}
                  />
                </View>
              </>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.colors.onSurface }]}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={navigateToLogin}
                style={styles.loginButton}
                labelStyle={[styles.loginButtonText, { color: theme.colors.primary }]}
              >
                Sign In
              </Button>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    marginBottom: 8,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
  },
  loginButton: {
    marginLeft: -8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;