import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@rently/shared';

export default function SearchScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'studio', label: 'Studio' },
    { id: 'furnished', label: 'Furnished' },
    { id: 'unfurnished', label: 'Unfurnished' },
    { id: 'pet-friendly', label: 'Pet Friendly' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const mockProperties = [
    {
      id: '1',
      title: 'Modern 2BR Apartment',
      location: 'Downtown District',
      price: '$1,200/month',
      bedrooms: 2,
      bathrooms: 1,
      type: 'apartment',
      image: '🏠',
    },
    {
      id: '2',
      title: 'Cozy Studio',
      location: 'Arts Quarter',
      price: '$800/month',
      bedrooms: 1,
      bathrooms: 1,
      type: 'studio',
      image: '🏡',
    },
    {
      id: '3',
      title: 'Family House',
      location: 'Suburbs',
      price: '$1,800/month',
      bedrooms: 3,
      bathrooms: 2,
      type: 'house',
      image: '🏘️',
    },
  ];

  const renderProperty = ({ item }: any) => (
    <Card style={styles.propertyCard}>
      <Card.Content>
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyEmoji}>{item.image}</Text>
          <View style={styles.propertyInfo}>
            <Title style={styles.propertyTitle}>{item.title}</Title>
            <Paragraph style={styles.propertyLocation}>{item.location}</Paragraph>
            <Paragraph style={styles.propertyPrice}>{item.price}</Paragraph>
          </View>
        </View>
        <View style={styles.propertyDetails}>
          <Chip style={styles.detailChip}>{item.bedrooms} BR</Chip>
          <Chip style={styles.detailChip}>{item.bathrooms} BA</Chip>
          <Chip style={styles.detailChip}>{item.type}</Chip>
        </View>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })}
          style={styles.viewButton}
        >
          View Details
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search properties..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilters.includes(item.id)}
              onPress={() => toggleFilter(item.id)}
              style={[
                styles.filterChip,
                selectedFilters.includes(item.id) && styles.selectedFilterChip
              ]}
              textStyle={selectedFilters.includes(item.id) ? styles.selectedFilterText : undefined}
            >
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={mockProperties}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        contentContainerStyle={styles.propertiesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchBar: {
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filtersList: {
    paddingHorizontal: 15,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedFilterChip: {
    backgroundColor: '#007AFF',
  },
  selectedFilterText: {
    color: '#ffffff',
  },
  propertiesList: {
    padding: 15,
  },
  propertyCard: {
    marginBottom: 15,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  propertyEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyLocation: {
    color: '#666',
    marginBottom: 5,
  },
  propertyPrice: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  propertyDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailChip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  viewButton: {
    borderColor: '#007AFF',
  },
});

