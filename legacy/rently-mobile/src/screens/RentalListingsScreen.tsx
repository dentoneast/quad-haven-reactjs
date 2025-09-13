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
  Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface RentalListing {
  id: number;
  rental_unit_id: number;
  title: string;
  description?: string;
  monthly_rent: number;
  available_from?: string;
  listing_status: string;
  featured: boolean;
  views_count: number;
  contact_phone?: string;
  contact_email?: string;
  unit_number: string;
  unit_type: string;
  premises_name: string;
  premises_address: string;
  city: string;
  state: string;
  created_at: string;
}

const RentalListingsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [listings, setListings] = useState<RentalListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState<RentalListing | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    rentalUnitId: '',
    title: '',
    description: '',
    monthlyRent: '',
    availableFrom: '',
    listingStatus: 'draft',
    featured: false,
    contactPhone: '',
    contactEmail: '',
  });

  const listingStatuses = ['draft', 'active', 'pending', 'rented', 'inactive'];

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchQuery, statusFilter, listings]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/rental-listings?role=lessor');
      // setListings(response.data.listings);
      
      // Mock data for now
      setListings([
        {
          id: 1,
          rental_unit_id: 1,
          title: 'Beautiful 2BR Apartment in Sunset Gardens',
          description: 'Spacious 2-bedroom apartment with balcony and city views',
          monthly_rent: 1800.00,
          available_from: '2024-01-01',
          listing_status: 'active',
          featured: true,
          views_count: 45,
          contact_phone: '+1-555-0101',
          contact_email: 'contact@sunsetgardens.com',
          unit_number: 'A101',
          unit_type: '2BR',
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd',
          city: 'Los Angeles',
          state: 'CA',
          created_at: '2024-01-01',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load rental listings');
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.premises_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.listing_status === statusFilter);
    }
    
    setFilteredListings(filtered);
  };

  const resetForm = () => {
    setFormData({
      rentalUnitId: '',
      title: '',
      description: '',
      monthlyRent: '',
      availableFrom: '',
      listingStatus: 'draft',
      featured: false,
      contactPhone: '',
      contactEmail: '',
    });
    setEditingListing(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (listingData: RentalListing) => {
    setFormData({
      rentalUnitId: listingData.rental_unit_id.toString(),
      title: listingData.title,
      description: listingData.description || '',
      monthlyRent: listingData.monthly_rent.toString(),
      availableFrom: listingData.available_from || '',
      listingStatus: listingData.listing_status,
      featured: listingData.featured,
      contactPhone: listingData.contact_phone || '',
      contactEmail: listingData.contact_email || '',
    });
    setEditingListing(listingData);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.monthlyRent.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingListing) {
        // TODO: Replace with actual API call
        // await api.put(`/rental-listings/${editingListing.id}`, formData);
        Alert.alert('Success', 'Rental listing updated successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.post('/rental-listings', formData);
        Alert.alert('Success', 'Rental listing created successfully');
      }
      
      setModalVisible(false);
      resetForm();
      loadListings();
    } catch (error) {
      Alert.alert('Error', 'Failed to save rental listing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (listingId: number) => {
    Alert.alert(
      'Delete Rental Listing',
      'Are you sure you want to delete this rental listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.delete(`/rental-listings/${listingId}`);
              Alert.alert('Success', 'Rental listing deleted successfully');
              loadListings();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rental listing');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'draft': return '#ff9800';
      case 'pending': return '#2196f3';
      case 'rented': return '#9c27b0';
      case 'inactive': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
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
          <Title style={styles.title}>Rental Listings Management</Title>
          <Text style={styles.subtitle}>
            Create and manage rental listings to attract tenants
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search listings..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'rented', label: 'Rented' },
          ]}
          style={styles.filterButtons}
        />

        {filteredListings.map((listing) => (
          <Card key={listing.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>{listing.title}</Title>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getStatusColor(listing.listing_status) }}
                >
                  {getStatusLabel(listing.listing_status)}
                </Chip>
              </View>
              
              {listing.description && (
                <Text style={styles.description}>{listing.description}</Text>
              )}
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  Unit {listing.unit_number}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {listing.unit_type}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {listing.premises_name}
                </Chip>
              </View>

              <Text style={styles.cardAddress}>
                {listing.premises_address}, {listing.city}, {listing.state}
              </Text>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Monthly Rent:</Text>
                <Text style={styles.priceValue}>${listing.monthly_rent.toFixed(2)}</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Views</Text>
                  <Text style={styles.statValue}>{listing.views_count}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Featured</Text>
                  <Chip mode="outlined" style={styles.chip}>
                    {listing.featured ? 'Yes' : 'No'}
                  </Chip>
                </View>
                {listing.available_from && (
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Available From</Text>
                    <Text style={styles.statValue}>
                      {new Date(listing.available_from).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              {(listing.contact_phone || listing.contact_email) && (
                <View style={styles.contactContainer}>
                  <Text style={styles.contactTitle}>Contact Information:</Text>
                  {listing.contact_phone && (
                    <Text style={styles.contactInfo}>📞 {listing.contact_phone}</Text>
                  )}
                  {listing.contact_email && (
                    <Text style={styles.contactInfo}>✉️ {listing.contact_email}</Text>
                  )}
                </View>
              )}
            </Card.Content>
            
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => openEditModal(listing)}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(listing.id)}
                icon="delete"
                textColor="#f44336"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {filteredListings.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="format-list-bulleted" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Rental Listings Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No listings match your search criteria.' 
                : 'Start by creating your first rental listing.'}
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
              {isEditing ? 'Edit Rental Listing' : 'Create New Rental Listing'}
            </Title>

            <TextInput
              label="Rental Unit ID *"
              value={formData.rentalUnitId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, rentalUnitId: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Listing Title *"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
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
              label="Monthly Rent *"
              value={formData.monthlyRent}
              onChangeText={(text) => setFormData(prev => ({ ...prev, monthlyRent: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Affix text="$" />}
            />

            <TextInput
              label="Available From"
              value={formData.availableFrom}
              onChangeText={(text) => setFormData(prev => ({ ...prev, availableFrom: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />

            <TextInput
              label="Listing Status"
              value={formData.listingStatus}
              onChangeText={(text) => setFormData(prev => ({ ...prev, listingStatus: text }))}
              mode="outlined"
              style={styles.input}
              list={listingStatuses.join(',')}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Featured Listing</Text>
              <Switch
                value={formData.featured}
                onValueChange={(value) => setFormData(prev => ({ ...prev, featured: value }))}
              />
            </View>

            <TextInput
              label="Contact Phone"
              value={formData.contactPhone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contactPhone: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Contact Email"
              value={formData.contactEmail}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contactEmail: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
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
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    fontStyle: 'italic',
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
  cardAddress: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactContainer: {
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    marginBottom: 4,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default RentalListingsScreen; 