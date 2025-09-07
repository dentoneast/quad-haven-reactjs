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
  FAB,
  Portal,
  Modal,
  List,
  Chip,
  useTheme,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface Premises {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  total_units?: number;
  year_built?: number;
  amenities?: string[];
  description?: string;
  is_active: boolean;
  created_at: string;
}

const PremisesManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [premises, setPremises] = useState<Premises[]>([]);
  const [filteredPremises, setFilteredPremises] = useState<Premises[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPremises, setEditingPremises] = useState<Premises | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'apartment',
    totalUnits: '',
    yearBuilt: '',
    amenities: [] as string[],
    description: '',
  });

  const propertyTypes = ['apartment', 'house', 'condo', 'townhouse', 'duplex', 'studio'];
  const commonAmenities = ['pool', 'gym', 'parking', 'laundry', 'elevator', 'doorman', 'balcony', 'fireplace'];

  useEffect(() => {
    loadPremises();
  }, []);

  useEffect(() => {
    filterPremises();
  }, [searchQuery, premises]);

  const loadPremises = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/premises?role=lessor');
      // setPremises(response.data.premises);
      
      // Mock data for now
      setPremises([
        {
          id: 1,
          name: 'Sunset Gardens Apartments',
          address: '123 Sunset Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zip_code: '90210',
          property_type: 'apartment',
          total_units: 50,
          year_built: 2020,
          amenities: ['pool', 'gym', 'parking'],
          description: 'Beautiful apartment complex with modern amenities',
          is_active: true,
          created_at: '2024-01-01',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load premises');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPremises = () => {
    if (!searchQuery.trim()) {
      setFilteredPremises(premises);
      return;
    }
    
    const filtered = premises.filter(premises =>
      premises.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      premises.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      premises.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPremises(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      propertyType: 'apartment',
      totalUnits: '',
      yearBuilt: '',
      amenities: [],
      description: '',
    });
    setEditingPremises(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (premisesData: Premises) => {
    setFormData({
      name: premisesData.name,
      address: premisesData.address,
      city: premisesData.city,
      state: premisesData.state,
      zipCode: premisesData.zip_code,
      propertyType: premisesData.property_type,
      totalUnits: premisesData.total_units?.toString() || '',
      yearBuilt: premisesData.year_built?.toString() || '',
      amenities: premisesData.amenities || [],
      description: premisesData.description || '',
    });
    setEditingPremises(premisesData);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zipCode.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingPremises) {
        // TODO: Replace with actual API call
        // await api.put(`/premises/${editingPremises.id}`, formData);
        Alert.alert('Success', 'Premises updated successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.post('/premises', formData);
        Alert.alert('Success', 'Premises created successfully');
      }
      
      setModalVisible(false);
      resetForm();
      loadPremises();
    } catch (error) {
      Alert.alert('Error', 'Failed to save premises');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (premisesId: number) => {
    Alert.alert(
      'Delete Premises',
      'Are you sure you want to delete this premises? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.delete(`/premises/${premisesId}`);
              Alert.alert('Success', 'Premises deleted successfully');
              loadPremises();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete premises');
            }
          },
        },
      ]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPremises();
    setRefreshing(false);
  };

  if (user?.user_type !== 'landlord') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This screen is for landlords only.</Text>
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
          <Title style={styles.title}>Premises Management</Title>
          <Text style={styles.subtitle}>
            Manage your rental properties and buildings
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search premises..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {filteredPremises.map((premisesData) => (
          <Card key={premisesData.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>{premisesData.name}</Title>
                <Chip
                  mode="outlined"
                  textStyle={{ color: premisesData.is_active ? '#4caf50' : '#f44336' }}
                >
                  {premisesData.is_active ? 'Active' : 'Inactive'}
                </Chip>
              </View>
              
              <Text style={styles.cardAddress}>
                {premisesData.address}, {premisesData.city}, {premisesData.state} {premisesData.zip_code}
              </Text>
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  {premisesData.property_type}
                </Chip>
                {premisesData.total_units && (
                  <Chip mode="outlined" style={styles.chip}>
                    {premisesData.total_units} units
                  </Chip>
                )}
                {premisesData.year_built && (
                  <Chip mode="outlined" style={styles.chip}>
                    Built {premisesData.year_built}
                  </Chip>
                )}
              </View>

              {premisesData.amenities && premisesData.amenities.length > 0 && (
                <View style={styles.amenitiesContainer}>
                  <Text style={styles.amenitiesTitle}>Amenities:</Text>
                  <View style={styles.amenitiesList}>
                    {premisesData.amenities.map((amenity, index) => (
                      <Chip key={index} mode="outlined" compact style={styles.amenityChip}>
                        {amenity}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {premisesData.description && (
                <Text style={styles.description}>{premisesData.description}</Text>
              )}
            </Card.Content>
            
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => openEditModal(premisesData)}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(premisesData.id)}
                icon="delete"
                textColor="#f44336"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {filteredPremises.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="office-building" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Premises Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No premises match your search.' : 'Start by adding your first rental property.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>
              {isEditing ? 'Edit Premises' : 'Add New Premises'}
            </Title>

            <TextInput
              label="Property Name *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Address *"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="City *"
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="State *"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <TextInput
              label="ZIP Code *"
              value={formData.zipCode}
              onChangeText={(text) => setFormData(prev => ({ ...prev, zipCode: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Property Type"
              value={formData.propertyType}
              onChangeText={(text) => setFormData(prev => ({ ...prev, propertyType: text }))}
              mode="outlined"
              style={styles.input}
              list={propertyTypes.join(',')}
            />

            <View style={styles.row}>
              <TextInput
                label="Total Units"
                value={formData.totalUnits}
                onChangeText={(text) => setFormData(prev => ({ ...prev, totalUnits: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Year Built"
                value={formData.yearBuilt}
                onChangeText={(text) => setFormData(prev => ({ ...prev, yearBuilt: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.amenitiesTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {commonAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  selected={formData.amenities.includes(amenity)}
                  onPress={() => toggleAmenity(amenity)}
                  style={styles.amenityChip}
                >
                  {amenity}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.modalButton}
                loading={isLoading}
                disabled={isLoading}
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={openAddModal}
      />
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
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  cardAddress: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  amenitiesContainer: {
    marginBottom: 12,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PremisesManagementScreen; 