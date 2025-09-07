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
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface RentalUnit {
  id: number;
  unit_number: string;
  premises_id: number;
  unit_type: string;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor_number?: number;
  rent_amount: number;
  security_deposit?: number;
  utilities_included: boolean;
  available_from?: string;
  is_available: boolean;
  features?: string[];
  images?: string[];
  premises_name: string;
  premises_address: string;
  created_at: string;
}

const RentalUnitsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [units, setUnits] = useState<RentalUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<RentalUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<RentalUnit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    unitNumber: '',
    premisesId: '',
    unitType: 'studio',
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
    floorNumber: '',
    rentAmount: '',
    securityDeposit: '',
    utilitiesIncluded: false,
    availableFrom: '',
    features: [] as string[],
    images: [] as string[],
  });

  const unitTypes = ['studio', '1BR', '2BR', '3BR', '4BR+'];
  const commonFeatures = ['balcony', 'walk-in closet', 'dishwasher', 'in-unit laundry', 'hardwood floors', 'central air', 'parking included'];

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    filterUnits();
  }, [searchQuery, availabilityFilter, units]);

  const loadUnits = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/rental-units?role=lessor');
      // setUnits(response.data.units);
      
      // Mock data for now
      setUnits([
        {
          id: 1,
          unit_number: 'A101',
          premises_id: 1,
          unit_type: '2BR',
          square_feet: 1200,
          bedrooms: 2,
          bathrooms: 2.0,
          floor_number: 1,
          rent_amount: 1800.00,
          security_deposit: 1800.00,
          utilities_included: true,
          available_from: '2024-01-01',
          is_available: true,
          features: ['balcony', 'walk-in closet', 'dishwasher'],
          images: ['unit1_1.jpg', 'unit1_2.jpg'],
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd',
          created_at: '2024-01-01',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load rental units');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUnits = () => {
    let filtered = units;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(unit =>
        unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.premises_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.premises_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by availability
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(unit => unit.is_available);
    } else if (availabilityFilter === 'rented') {
      filtered = filtered.filter(unit => !unit.is_available);
    }
    
    setFilteredUnits(filtered);
  };

  const resetForm = () => {
    setFormData({
      unitNumber: '',
      premisesId: '',
      unitType: 'studio',
      squareFeet: '',
      bedrooms: '',
      bathrooms: '',
      floorNumber: '',
      rentAmount: '',
      securityDeposit: '',
      utilitiesIncluded: false,
      availableFrom: '',
      features: [],
      images: [],
    });
    setEditingUnit(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (unitData: RentalUnit) => {
    setFormData({
      unitNumber: unitData.unit_number,
      premisesId: unitData.premises_id.toString(),
      unitType: unitData.unit_type,
      squareFeet: unitData.square_feet?.toString() || '',
      bedrooms: unitData.bedrooms?.toString() || '',
      bathrooms: unitData.bathrooms?.toString() || '',
      floorNumber: unitData.floor_number?.toString() || '',
      rentAmount: unitData.rent_amount.toString(),
      securityDeposit: unitData.security_deposit?.toString() || '',
      utilitiesIncluded: unitData.utilities_included,
      availableFrom: unitData.available_from || '',
      features: unitData.features || [],
      images: unitData.images || [],
    });
    setEditingUnit(unitData);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.unitNumber.trim() || !formData.premisesId.trim() || !formData.rentAmount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingUnit) {
        // TODO: Replace with actual API call
        // await api.put(`/rental-units/${editingUnit.id}`, formData);
        Alert.alert('Success', 'Rental unit updated successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.post('/rental-units', formData);
        Alert.alert('Success', 'Rental unit created successfully');
      }
      
      setModalVisible(false);
      resetForm();
      loadUnits();
    } catch (error) {
      Alert.alert('Error', 'Failed to save rental unit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (unitId: number) => {
    Alert.alert(
      'Delete Rental Unit',
      'Are you sure you want to delete this rental unit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.delete(`/rental-units/${unitId}`);
              Alert.alert('Success', 'Rental unit deleted successfully');
              loadUnits();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rental unit');
            }
          },
        },
      ]
    );
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUnits();
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
          <Title style={styles.title}>Rental Units Management</Title>
          <Text style={styles.subtitle}>
            Manage individual rental units within your properties
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search units..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'available', label: 'Available' },
            { value: 'rented', label: 'Rented' },
          ]}
          style={styles.filterButtons}
        />

        {filteredUnits.map((unit) => (
          <Card key={unit.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Unit {unit.unit_number}</Title>
                <Chip
                  mode="outlined"
                  textStyle={{ color: unit.is_available ? '#4caf50' : '#f44336' }}
                >
                  {unit.is_available ? 'Available' : 'Rented'}
                </Chip>
              </View>
              
              <Text style={styles.cardAddress}>
                {unit.premises_name} - {unit.premises_address}
              </Text>
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  {unit.unit_type}
                </Chip>
                {unit.square_feet && (
                  <Chip mode="outlined" style={styles.chip}>
                    {unit.square_feet} sq ft
                  </Chip>
                )}
                {unit.bedrooms !== undefined && (
                  <Chip mode="outlined" style={styles.chip}>
                    {unit.bedrooms} BR
                  </Chip>
                )}
                {unit.bathrooms && (
                  <Chip mode="outlined" style={styles.chip}>
                    {unit.bathrooms} Bath
                  </Chip>
                )}
                {unit.floor_number && (
                  <Chip mode="outlined" style={styles.chip}>
                    Floor {unit.floor_number}
                  </Chip>
                )}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Monthly Rent:</Text>
                <Text style={styles.priceValue}>${unit.rent_amount.toFixed(2)}</Text>
              </View>

              {unit.security_deposit && (
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Security Deposit:</Text>
                  <Text style={styles.priceValue}>${unit.security_deposit.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.utilitiesContainer}>
                <Text style={styles.utilitiesLabel}>Utilities:</Text>
                <Chip mode="outlined" style={styles.chip}>
                  {unit.utilities_included ? 'Included' : 'Not Included'}
                </Chip>
              </View>

              {unit.features && unit.features.length > 0 && (
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Features:</Text>
                  <View style={styles.featuresList}>
                    {unit.features.map((feature, index) => (
                      <Chip key={index} mode="outlined" compact style={styles.featureChip}>
                        {feature}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {unit.available_from && (
                <Text style={styles.availableFrom}>
                  Available from: {new Date(unit.available_from).toLocaleDateString()}
                </Text>
              )}
            </Card.Content>
            
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => openEditModal(unit)}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(unit.id)}
                icon="delete"
                textColor="#f44336"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {filteredUnits.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="home-city" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Rental Units Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || availabilityFilter !== 'all' 
                ? 'No units match your search criteria.' 
                : 'Start by adding your first rental unit.'}
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
              {isEditing ? 'Edit Rental Unit' : 'Add New Rental Unit'}
            </Title>

            <TextInput
              label="Unit Number *"
              value={formData.unitNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, unitNumber: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Premises ID *"
              value={formData.premisesId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, premisesId: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Unit Type"
              value={formData.unitType}
              onChangeText={(text) => setFormData(prev => ({ ...prev, unitType: text }))}
              mode="outlined"
              style={styles.input}
              list={unitTypes.join(',')}
            />

            <View style={styles.row}>
              <TextInput
                label="Square Feet"
                value={formData.squareFeet}
                onChangeText={(text) => setFormData(prev => ({ ...prev, squareFeet: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Floor Number"
                value={formData.floorNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, floorNumber: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Bedrooms"
                value={formData.bedrooms}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bedrooms: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Bathrooms"
                value={formData.bathrooms}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bathrooms: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Monthly Rent *"
                value={formData.rentAmount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, rentAmount: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                left={<TextInput.Affix text="$" />}
              />
              <TextInput
                label="Security Deposit"
                value={formData.securityDeposit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, securityDeposit: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                left={<TextInput.Affix text="$" />}
              />
            </View>

            <TextInput
              label="Available From"
              value={formData.availableFrom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, availableFrom: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.featuresTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {commonFeatures.map((feature) => (
                <Chip
                  key={feature}
                  selected={formData.features.includes(feature)}
                  onPress={() => toggleFeature(feature)}
                  style={styles.featureChip}
                >
                  {feature}
                </Chip>
              ))}
            </View>

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
  filterButtons: {
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
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  utilitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  utilitiesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  availableFrom: {
    fontSize: 12,
    opacity: 0.7,
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
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresGrid: {
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

export default RentalUnitsScreen; 