import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '@homely-quad/shared';
import { formatCurrency } from '@homely-quad/shared';

// Mock data - in a real app, this would come from your API
const featuredProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Downtown',
    price: 2500,
    currency: 'USD',
    location: 'New York, NY',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: '2',
    title: 'Cozy House with Garden',
    price: 1800,
    currency: 'USD',
    location: 'San Francisco, CA',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: '3',
    title: 'Luxury Condo with Pool',
    price: 3500,
    currency: 'USD',
    location: 'Miami, FL',
    image: 'https://via.placeholder.com/300x200',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.firstName || 'User'}!
        </Text>
        <Text style={styles.subtitle}>
          Find your perfect home
        </Text>
      </View>

      <View style={styles.searchSection}>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search Properties</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Properties</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredProperties.map((property) => (
            <TouchableOpacity key={property.id} style={styles.propertyCard}>
              <Image source={{ uri: property.image }} style={styles.propertyImage} />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertyLocation}>{property.location}</Text>
                <Text style={styles.propertyPrice}>
                  {formatCurrency(property.price, property.currency)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>My Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Recent Searches</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  searchSection: {
    padding: 20,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  propertyCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 20,
  },
  propertyImage: {
    width: '100%',
    height: 160,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
