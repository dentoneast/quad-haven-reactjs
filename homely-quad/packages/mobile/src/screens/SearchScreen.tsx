import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@homely-quad/shared';
import { PropertySearchFilters } from '@homely-quad/shared';

export default function SearchScreen() {
  const [filters, setFilters] = useState<PropertySearchFilters>({
    minPrice: undefined,
    maxPrice: undefined,
    propertyType: [],
    location: '',
    features: [],
  });

  const propertyTypes = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Condo', value: 'condo' },
    { label: 'Studio', value: 'studio' },
    { label: 'Townhouse', value: 'townhouse' },
  ];

  const features = [
    { label: 'Parking', value: 'parking' },
    { label: 'Gym', value: 'gym' },
    { label: 'Pool', value: 'pool' },
    { label: 'Balcony', value: 'balcony' },
    { label: 'Pet Friendly', value: 'pet_friendly' },
  ];

  const handlePropertyTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType?.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...(prev.propertyType || []), type]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const handleSearch = () => {
    // Implement search logic
    console.log('Search filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      propertyType: [],
      location: '',
      features: [],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Search Properties</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city, state, or address"
            value={filters.location}
            onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min Price"
              value={filters.minPrice?.toString() || ''}
              onChangeText={(text) => setFilters(prev => ({ 
                ...prev, 
                minPrice: text ? parseInt(text) : undefined 
              }))}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>to</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max Price"
              value={filters.maxPrice?.toString() || ''}
              onChangeText={(text) => setFilters(prev => ({ 
                ...prev, 
                maxPrice: text ? parseInt(text) : undefined 
              }))}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.optionsContainer}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  filters.propertyType?.includes(type.value) && styles.optionSelected
                ]}
                onPress={() => handlePropertyTypeToggle(type.value)}
              >
                <Text style={[
                  styles.optionText,
                  filters.propertyType?.includes(type.value) && styles.optionTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.optionsContainer}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.value}
                style={[
                  styles.option,
                  filters.features?.includes(feature.value) && styles.optionSelected
                ]}
                onPress={() => handleFeatureToggle(feature.value)}
              >
                <Text style={[
                  styles.optionText,
                  filters.features?.includes(feature.value) && styles.optionTextSelected
                ]}>
                  {feature.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Search"
            onPress={handleSearch}
            style={styles.searchButton}
          />
          <Button
            title="Clear"
            onPress={handleClear}
            variant="outline"
            style={styles.clearButton}
          />
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  priceSeparator: {
    fontSize: 16,
    color: '#6C757D',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  searchButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
});
