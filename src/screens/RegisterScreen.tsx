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
import { useAuth } from '../contexts/AuthContext';
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

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateOrganizationData = (key: string, value: string) => {
    setOrganizationData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password || !formData.firstName.trim() || !formData.lastName.trim()) {
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

    // Validate organization fields if user is a landlord
    if (formData.userType === 'landlord') {
      if (!organizationData.name.trim() || !organizationData.slug.trim()) {
        Alert.alert('Error', 'Organization name and slug are required for landlords');
        return false;
      }
      
      if (organizationData.slug.includes(' ')) {
        Alert.alert('Error', 'Organization slug cannot contain spaces');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address.trim() || undefined,
        userType: formData.userType,
        ...(formData.userType === 'landlord' && {
          organizationName: organizationData.name.trim(),
          organizationSlug: organizationData.slug.trim(),
          organizationEmail: organizationData.email.trim() || formData.email.trim(),
          organizationPhone: organizationData.phone.trim() || undefined,
          organizationAddress: organizationData.address.trim() || undefined,
          organizationCity: organizationData.city.trim() || undefined,
          organizationState: organizationData.state.trim() || undefined,
          organizationZipCode: organizationData.zipCode.trim() || undefined,
          organizationWebsite: organizationData.website.trim() || undefined,
          organizationDescription: organizationData.description.trim() || undefined,
        }),
      };

      await register(userData);
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface}>
          <Title style={styles.title}>Create Account</Title>
          <Text style={styles.subtitle}>Join our rental community</Text>

          <SegmentedButtons
            value={formData.userType}
            onValueChange={(value) => updateFormData('userType', value)}
            buttons={[
              { value: 'tenant', label: 'Tenant' },
              { value: 'landlord', label: 'Landlord' },
            ]}
            style={styles.userTypeSelector}
          />

          <TextInput
            label="First Name *"
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Last Name *"
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label="Date of Birth (YYYY-MM-DD)"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateFormData('dateOfBirth', value)}
            mode="outlined"
            style={styles.input}
            placeholder="2020-01-01"
            left={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={2}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
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
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoComplete="password"
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />

          {/* Organization Section for Landlords */}
          {formData.userType === 'landlord' && (
            <>
              <Divider style={styles.divider} />
              <Title style={styles.sectionTitle}>Organization Details</Title>
              <Text style={styles.sectionSubtitle}>
                Set up your property management organization
              </Text>

              <TextInput
                label="Organization Name *"
                value={organizationData.name}
                onChangeText={(value) => {
                  updateOrganizationData('name', value);
                  updateOrganizationData('slug', generateSlug(value));
                }}
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                left={<TextInput.Icon icon="office-building" />}
              />

              <TextInput
                label="Organization Slug *"
                value={organizationData.slug}
                onChangeText={(value) => updateOrganizationData('slug', value)}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                left={<TextInput.Icon icon="link" />}
                placeholder="my-organization"
              />

              <TextInput
                label="Organization Email"
                value={organizationData.email}
                onChangeText={(value) => updateOrganizationData('email', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                placeholder="info@organization.com"
              />

              <TextInput
                label="Organization Phone"
                value={organizationData.phone}
                onChangeText={(value) => updateOrganizationData('phone', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
              />

              <TextInput
                label="Organization Address"
                value={organizationData.address}
                onChangeText={(value) => updateOrganizationData('address', value)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={2}
                left={<TextInput.Icon icon="map-marker" />}
              />

              <View style={styles.row}>
                <TextInput
                  label="City"
                  value={organizationData.city}
                  onChangeText={(value) => updateOrganizationData('city', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  left={<TextInput.Icon icon="city" />}
                />
                <TextInput
                  label="State"
                  value={organizationData.state}
                  onChangeText={(value) => updateOrganizationData('state', value)}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  left={<TextInput.Icon icon="map" />}
                />
              </View>

              <TextInput
                label="ZIP Code"
                value={organizationData.zipCode}
                onChangeText={(value) => updateOrganizationData('zipCode', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                left={<TextInput.Icon icon="map-marker" />}
              />

              <TextInput
                label="Website"
                value={organizationData.website}
                onChangeText={(value) => updateOrganizationData('website', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="url"
                autoCapitalize="none"
                left={<TextInput.Icon icon="web" />}
                placeholder="https://example.com"
              />

              <TextInput
                label="Description"
                value={organizationData.description}
                onChangeText={(value) => updateOrganizationData('description', value)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                left={<TextInput.Icon icon="text" />}
                placeholder="Tell us about your organization..."
              />
            </>
          )}

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={navigateToLogin}
              compact
            >
              Sign In
            </Button>
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 20,
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
    opacity: 0.7,
  },
  userTypeSelector: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
});

export default RegisterScreen; 