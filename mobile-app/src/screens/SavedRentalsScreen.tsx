import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  FAB,
  Portal,
  Modal,
  IconButton,
  List,
  Divider,
  Badge,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { getApiUrl } from '../config/app';
import * as SecureStore from 'expo-secure-store';

interface SavedRental {
  id: number;
  rental_listing_id: number;
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
  saved_date: string;
  notes?: string;
}

const SavedRentalsScreen: React.FC = () => {
  const [savedRentals, setSavedRentals] = useState<SavedRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRental, setSelectedRental] = useState<SavedRental | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editNotesModalVisible, setEditNotesModalVisible] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    loadSavedRentals();
  }, []);

  const loadSavedRentals = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.get(getApiUrl('/saved-rentals'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        setSavedRentals(response.data.saved_rentals || []);
      }
    } catch (error) {
      console.error('Error loading saved rentals:', error);
      Alert.alert('Error', 'Failed to load saved rentals');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedRentals();
    setRefreshing(false);
  };

  const removeSavedRental = async (rentalId: number) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.delete(getApiUrl(`/saved-rentals/${rentalId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        setSavedRentals(prev => prev.filter(rental => rental.id !== rentalId));
        Alert.alert('Success', 'Rental removed from saved list');
      }
    } catch (error) {
      console.error('Error removing saved rental:', error);
      Alert.alert('Error', 'Failed to remove rental from saved list');
    }
  };

  const updateNotes = async () => {
    if (!selectedRental) return;

    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.put(getApiUrl(`/saved-rentals/${selectedRental.id}`), {
        notes: editNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        setSavedRentals(prev => prev.map(rental => 
          rental.id === selectedRental.id 
            ? { ...rental, notes: editNotes }
            : rental
        ));
        setEditNotesModalVisible(false);
        Alert.alert('Success', 'Notes updated successfully');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      Alert.alert('Error', 'Failed to update notes');
    }
  };

  const handleRemoveRental = (rental: SavedRental) => {
    Alert.alert(
      'Remove Saved Rental',
      `Are you sure you want to remove "${rental.title}" from your saved list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeSavedRental(rental.id) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading saved rentals...</Text>
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
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>Saved Rentals</Title>
            <Text style={styles.headerSubtitle}>
              {savedRentals.length} rental{savedRentals.length !== 1 ? 's' : ''} in your list
            </Text>
          </Card.Content>
        </Card>

        {/* Saved Rentals List */}
        {savedRentals.map((rental) => (
          <Card key={rental.id} style={styles.rentalCard}>
            <Card.Content>
              <View style={styles.rentalHeader}>
                <Title style={styles.rentalTitle}>{rental.title}</Title>
                <View style={styles.rentalActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => {
                      setSelectedRental(rental);
                      setEditNotes(rental.notes || '');
                      setEditNotesModalVisible(true);
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleRemoveRental(rental)}
                  />
                </View>
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
                <View style={styles.detailItem}>
                  <MaterialIcons name="attach-money" size={16} color="#666" />
                  <Text style={styles.detailText}>${rental.monthly_rent}/month</Text>
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

              {rental.amenities && rental.amenities.length > 0 && (
                <View style={styles.amenitiesContainer}>
                  {rental.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip key={index} mode="outlined" style={styles.amenityChip}>
                      {amenity}
                    </Chip>
                  ))}
                  {rental.amenities.length > 3 && (
                    <Chip mode="outlined" style={styles.amenityChip}>
                      +{rental.amenities.length - 3} more
                    </Chip>
                  )}
                </View>
              )}

              {rental.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Your Notes:</Text>
                  <Text style={styles.notesText}>{rental.notes}</Text>
                </View>
              )}

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

              <View style={styles.savedInfo}>
                <Text style={styles.savedDate}>
                  Saved on {new Date(rental.saved_date).toLocaleDateString()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Empty State */}
        {savedRentals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="favorite-border" size={64} color="#ccc" />
              <Title style={styles.emptyTitle}>No Saved Rentals</Title>
              <Text style={styles.emptyText}>
                You haven't saved any rental properties yet. Start browsing and save the ones you like!
              </Text>
              <Button
                mode="contained"
                onPress={() => Alert.alert('Navigate', 'Navigate to search rentals')}
                style={styles.browseButton}
              >
                Browse Rentals
              </Button>
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

                {selectedRental.notes && (
                  <View style={styles.modalNotes}>
                    <Text style={styles.modalLabel}>Your Notes:</Text>
                    <Text style={styles.modalNotesText}>{selectedRental.notes}</Text>
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

      {/* Edit Notes Modal */}
      <Portal>
        <Modal
          visible={editNotesModalVisible}
          onDismiss={() => setEditNotesModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Edit Notes</Title>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Your Notes:</Text>
            <TextInput
              mode="outlined"
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Add your notes about this rental..."
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setEditNotesModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={updateNotes}
              style={styles.modalButton}
            >
              Save Notes
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
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
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
  rentalActions: {
    flexDirection: 'row',
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
  notesContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailsButton: {
    flex: 1,
    marginRight: 8,
  },
  contactButton: {
    flex: 1,
    marginLeft: 8,
  },
  savedInfo: {
    alignItems: 'flex-end',
  },
  savedDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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
    marginBottom: 16,
  },
  browseButton: {
    marginTop: 8,
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
    marginBottom: 8,
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
  modalNotes: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  modalNotesText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  notesInput: {
    marginTop: 8,
  },
});

export default SavedRentalsScreen;
