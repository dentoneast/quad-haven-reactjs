import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Searchbar,
  FAB,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
  List,
  Divider,
  Badge,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { getApiUrl } from '../config/app';
import * as SecureStore from 'expo-secure-store';

interface RentalListing {
  id: number;
  title: string;
  description: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  available_date: string;
  premises_name: string;
  unit_number: string;
  landlord_name: string;
  amenities: string[];
  images: string[];
}

const SearchRentalsScreen: React.FC = () => {
  const [rentals, setRentals] = useState<RentalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrice, setFilterPrice] = useState<string>('all');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [selectedRental, setSelectedRental] = useState<RentalListing | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    loadRentals();
  }, [filterPrice, filterBedrooms, filterLocation]);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.get(getApiUrl('/rental-listings'), {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          price_range: filterPrice === 'all' ? undefined : filterPrice,
          bedrooms: filterBedrooms === 'all' ? undefined : filterBedrooms,
          location: filterLocation === 'all' ? undefined : filterLocation,
        }
      });

      if (response.data.status === 200) {
        setRentals(response.data.rental_listings || []);
      }
    } catch (error) {
      console.error('Error loading rentals:', error);
      Alert.alert('Error', 'Failed to load rental listings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRentals();
    setRefreshing(false);
  };

  const filteredRentals = rentals.filter(rental => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rental.title.toLowerCase().includes(query) ||
        rental.description.toLowerCase().includes(query) ||
        rental.address.toLowerCase().includes(query) ||
        rental.city.toLowerCase().includes(query) ||
        rental.premises_name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getPriceRangeLabel = (price: string) => {
    switch (price) {
      case 'low': return 'Under $1,000';
      case 'medium': return '$1,000 - $2,000';
      case 'high': return 'Over $2,000';
      default: return 'All Prices';
    }
  };

  const getBedroomsLabel = (bedrooms: string) => {
    switch (bedrooms) {
      case '1': return '1 Bedroom';
      case '2': return '2 Bedrooms';
      case '3': return '3+ Bedrooms';
      default: return 'All Sizes';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading rental listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <Searchbar
              placeholder="Search rentals..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
          </Card.Content>
        </Card>

        {/* Filters */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Filters</Title>
            
            <SegmentedButtons
              value={filterPrice}
              onValueChange={setFilterPrice}
              buttons={[
                { value: 'all', label: 'All Prices' },
                { value: 'low', label: 'Under $1K' },
                { value: 'medium', label: '$1K-$2K' },
                { value: 'high', label: 'Over $2K' },
              ]}
              style={styles.segmentedButtons}
            />
            
            <SegmentedButtons
              value={filterBedrooms}
              onValueChange={setFilterBedrooms}
              buttons={[
                { value: 'all', label: 'All Sizes' },
                { value: '1', label: '1 BR' },
                { value: '2', label: '2 BR' },
                { value: '3', label: '3+ BR' },
              ]}
              style={[styles.segmentedButtons, { marginTop: 8 }]}
            />
          </Card.Content>
        </Card>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredRentals.length} rental{filteredRentals.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Rental Listings */}
        {filteredRentals.map((rental) => (
          <Card key={rental.id} style={styles.rentalCard}>
            <Card.Content>
              <View style={styles.rentalHeader}>
                <Title style={styles.rentalTitle}>{rental.title}</Title>
                <Text style={styles.rentalPrice}>${rental.monthly_rent}/month</Text>
              </View>
              
              <Paragraph style={styles.rentalDescription}>
                {rental.description}
              </Paragraph>
              
              <View style={styles.rentalDetails}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="bed" size={16} color="#666" />
                  <Text style={styles.detailText}>{rental.bedrooms} BR</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="bathroom" size={16} color="#666" />
                  <Text style={styles.detailText}>{rental.bathrooms} BA</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="square-foot" size={16} color="#666" />
                  <Text style={styles.detailText}>{rental.square_feet} sq ft</Text>
                </View>
              </View>
              
              <View style={styles.locationDetails}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="location-on" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {rental.address}, {rental.city}, {rental.state} {rental.zip_code}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="business" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {rental.premises_name} - Unit {rental.unit_number}
                  </Text>
                </View>
              </View>

              <View style={styles.amenitiesContainer}>
                {rental.amenities?.slice(0, 3).map((amenity, index) => (
                  <Chip key={index} mode="outlined" style={styles.amenityChip}>
                    {amenity}
                  </Chip>
                ))}
                {rental.amenities?.length > 3 && (
                  <Chip mode="outlined" style={styles.amenityChip}>
                    +{rental.amenities.length - 3} more
                  </Chip>
                )}
              </View>

              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setSelectedRental(rental);
                    setDetailsModalVisible(true);
                  }}
                  style={styles.detailsButton}
                >
                  View Details
                </Button>
                <Button
                  mode="contained"
                  onPress={() => Alert.alert('Contact', 'Contact landlord functionality')}
                  style={styles.contactButton}
                >
                  Contact Landlord
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Empty State */}
        {filteredRentals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="search" size={64} color="#ccc" />
              <Title style={styles.emptyTitle}>No Rentals Found</Title>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? `No rentals match "${searchQuery}". Try adjusting your search or filters.`
                  : 'No rental listings available with the current filters.'}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={detailsModalVisible}
          onDismiss={() => setDetailsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedRental && (
            <>
              <Title style={styles.modalTitle}>
                {selectedRental.title}
              </Title>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalPrice}>
                  ${selectedRental.monthly_rent}/month
                </Text>
                
                <Text style={styles.modalDescription}>
                  {selectedRental.description}
                </Text>
                
                <View style={styles.modalDetails}>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Bedrooms: </Text>
                    {selectedRental.bedrooms}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Bathrooms: </Text>
                    {selectedRental.bathrooms}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Square Feet: </Text>
                    {selectedRental.square_feet}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Available: </Text>
                    {new Date(selectedRental.available_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Location: </Text>
                    {selectedRental.address}, {selectedRental.city}, {selectedRental.state} {selectedRental.zip_code}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Property: </Text>
                    {selectedRental.premises_name} - Unit {selectedRental.unit_number}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Landlord: </Text>
                    {selectedRental.landlord_name}
                  </Text>
                </View>

                {selectedRental.amenities && selectedRental.amenities.length > 0 && (
                  <View style={styles.modalAmenities}>
                    <Text style={styles.modalLabel}>Amenities:</Text>
                    <View style={styles.amenitiesGrid}>
                      {selectedRental.amenities.map((amenity, index) => (
                        <Chip key={index} mode="outlined" style={styles.modalAmenityChip}>
                          {amenity}
                        </Chip>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setDetailsModalVisible(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    setDetailsModalVisible(false);
                    Alert.alert('Contact', 'Contact landlord functionality');
                  }}
                  style={styles.modalButton}
                >
                  Contact Landlord
                </Button>
              </View>
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  searchCard: {
    margin: 16,
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
  },
  filterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  resultsHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  rentalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rentalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rentalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  rentalDescription: {
    marginBottom: 12,
    color: '#666',
    lineHeight: 20,
  },
  rentalDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  locationDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    marginRight: 8,
  },
  contactButton: {
    flex: 1,
    marginLeft: 8,
  },
  emptyCard: {
    margin: 16,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 20,
  },
  modalContent: {
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    lineHeight: 22,
  },
  modalDetails: {
    marginBottom: 16,
  },
  modalDetail: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    lineHeight: 20,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalAmenities: {
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  modalAmenityChip: {
    marginRight: 8,
    marginBottom: 8,
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

export default SearchRentalsScreen;
