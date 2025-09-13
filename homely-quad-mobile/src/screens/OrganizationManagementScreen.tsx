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
  Card,
  Chip,
  useTheme,
  Divider,
  List,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  subscription_plan?: string;
  subscription_status?: string;
  max_users?: number;
  max_properties?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const OrganizationManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    if (!user?.organization_id) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/organizations/${user.organization_id}`);
      // setOrganization(response.data.organization);
      
      // Mock data for now
      setOrganization({
        id: user.organization_id,
        name: 'Sunset Property Management',
        slug: 'sunset-properties',
        description: 'Professional property management company specializing in residential properties in Los Angeles',
        website: 'https://sunsetproperties.com',
        phone: '+1-555-0100',
        email: 'info@sunsetproperties.com',
        address: '1000 Sunset Blvd, Los Angeles, CA 90210',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        country: 'USA',
        subscription_plan: 'premium',
        subscription_status: 'active',
        max_users: 25,
        max_properties: 100,
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      });

      // Populate form data
      setFormData({
        name: 'Sunset Property Management',
        description: 'Professional property management company specializing in residential properties in Los Angeles',
        phone: '+1-555-0100',
        address: '1000 Sunset Blvd, Los Angeles, CA 90210',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        website: 'https://sunsetproperties.com',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load organization details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Organization name is required');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put(`/organizations/${organization?.id}`, formData);
      Alert.alert('Success', 'Organization updated successfully');
      setIsEditing(false);
      loadOrganization();
    } catch (error) {
      Alert.alert('Error', 'Failed to update organization');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrganization();
    setRefreshing(false);
  };

  if (!user?.organization_id) {
    return (
      <View style={styles.container}>
        <Surface style={styles.emptyState}>
          <MaterialCommunityIcons name="office-building" size={64} color="#ccc" />
          <Title style={styles.emptyTitle}>No Organization</Title>
          <Text style={styles.emptyText}>
            You don't belong to any organization. Contact your administrator to get access.
          </Text>
        </Surface>
      </View>
    );
  }

  if (!organization) {
    return (
      <View style={styles.container}>
        <Text>Loading organization details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <Title style={styles.title}>Organization Management</Title>
          <Text style={styles.subtitle}>
            Manage your property management organization
          </Text>
        </Surface>

        <Card style={styles.organizationCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>{organization.name}</Title>
              <Chip
                mode="outlined"
                textStyle={{ color: organization.is_active ? '#4caf50' : '#f44336' }}
              >
                {organization.is_active ? 'Active' : 'Inactive'}
              </Chip>
            </View>

            <Text style={styles.organizationSlug}>@{organization.slug}</Text>

            {organization.description && (
              <Text style={styles.description}>{organization.description}</Text>
            )}

            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Subscription</Text>
                <Chip mode="outlined" style={styles.chip}>
                  {organization.subscription_plan}
                </Chip>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Status</Text>
                <Chip mode="outlined" style={styles.chip}>
                  {organization.subscription_status}
                </Chip>
              </View>
            </View>

            <View style={styles.limitsContainer}>
              <Text style={styles.limitsTitle}>Account Limits</Text>
              <View style={styles.limitsRow}>
                <Text style={styles.limitsLabel}>Max Users:</Text>
                <Text style={styles.limitsValue}>{organization.max_users}</Text>
              </View>
              <View style={styles.limitsRow}>
                <Text style={styles.limitsLabel}>Max Properties:</Text>
                <Text style={styles.limitsValue}>{organization.max_properties}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <List.Item
                title="Email"
                description={organization.email}
                left={(props) => <List.Icon {...props} icon="email" />}
              />
              
              {organization.phone && (
                <List.Item
                  title="Phone"
                  description={organization.phone}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                />
              )}
              
              {organization.website && (
                <List.Item
                  title="Website"
                  description={organization.website}
                  left={(props) => <List.Icon {...props} icon="web" />}
                />
              )}
              
              {organization.address && (
                <List.Item
                  title="Address"
                  description={`${organization.address}, ${organization.city}, ${organization.state} ${organization.zip_code}`}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
              )}
            </View>

            <Text style={styles.createdAt}>
              Created: {new Date(organization.created_at).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>

        {isEditing ? (
          <Surface style={styles.editSection}>
            <Title style={styles.sectionTitle}>Edit Organization</Title>
            
            <TextInput
              label="Organization Name *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <TextInput
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Address"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
            />

            <View style={styles.row}>
              <TextInput
                label="City"
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="State"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <TextInput
              label="ZIP Code"
              value={formData.zipCode}
              onChangeText={(text) => setFormData(prev => ({ ...prev, zipCode: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Website"
              value={formData.website}
              onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="url"
              placeholder="https://example.com"
            />

            <View style={styles.editActions}>
              <Button
                mode="outlined"
                onPress={() => setIsEditing(false)}
                style={styles.editButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.editButton}
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </View>
          </Surface>
        ) : (
          <Surface style={styles.actionsSection}>
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              icon="pencil"
              style={styles.actionButton}
            >
              Edit Organization
            </Button>
          </Surface>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  organizationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  organizationSlug: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  chip: {
    marginTop: 4,
  },
  limitsContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  limitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  limitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  limitsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  limitsValue: {
    fontSize: 14,
    color: '#6200ee',
  },
  divider: {
    marginVertical: 16,
  },
  contactSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  createdAt: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  editSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  actionButton: {
    backgroundColor: '#6200ee',
  },
  emptyState: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default OrganizationManagementScreen; 