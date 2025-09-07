import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Property } from '@homely-quad/shared';
import { formatCurrency, formatDate } from '@homely-quad/shared';
import { Button } from '@homely-quad/shared';

// Mock property data - in a real app, this would come from navigation params
const mockProperty: Property = {
  id: '1',
  title: 'Modern Apartment in Downtown',
  description: 'Beautiful modern apartment with stunning city views. Features include hardwood floors, granite countertops, and a private balcony.',
  price: 2500,
  currency: 'USD',
  location: {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postalCode: '10001',
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  images: [
    'https://via.placeholder.com/400x300',
    'https://via.placeholder.com/400x300',
    'https://via.placeholder.com/400x300',
  ],
  features: [
    { id: '1', name: 'Bedrooms', value: 2, category: 'basic' },
    { id: '2', name: 'Bathrooms', value: 2, category: 'basic' },
    { id: '3', name: 'Square Feet', value: 1200, category: 'basic' },
    { id: '4', name: 'Parking', value: true, category: 'amenities' },
    { id: '5', name: 'Gym', value: true, category: 'amenities' },
    { id: '6', name: 'Pool', value: true, category: 'amenities' },
  ],
  type: 'apartment',
  status: 'available',
  owner: {
    id: '1',
    email: 'owner@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

export default function PropertyDetailScreen() {
  const property = mockProperty;

  const renderFeature = (feature: any) => (
    <View key={feature.id} style={styles.featureItem}>
      <Text style={styles.featureName}>{feature.name}</Text>
      <Text style={styles.featureValue}>
        {typeof feature.value === 'boolean' 
          ? (feature.value ? 'Yes' : 'No')
          : feature.value
        }
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.images[0] }} style={styles.mainImage} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>
          {property.location.address}, {property.location.city}, {property.location.state}
        </Text>
        <Text style={styles.price}>
          {formatCurrency(property.price, property.currency)}/month
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description}</Text>

        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresContainer}>
          {property.features.map(renderFeature)}
        </View>

        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{property.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{property.status}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Listed</Text>
            <Text style={styles.detailValue}>{formatDate(property.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Contact Owner"
            onPress={() => {}}
            style={styles.contactButton}
          />
          <Button
            title="Add to Favorites"
            onPress={() => {}}
            variant="outline"
            style={styles.favoriteButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  featureName: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  contactButton: {
    flex: 1,
  },
  favoriteButton: {
    flex: 1,
  },
});
