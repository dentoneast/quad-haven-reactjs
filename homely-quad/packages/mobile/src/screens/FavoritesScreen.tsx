import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useApi } from '@homely-quad/shared';
import { propertyService } from '@homely-quad/shared';
import { Property } from '@homely-quad/shared';
import { formatCurrency } from '@homely-quad/shared';

export default function FavoritesScreen() {
  const { data: favorites, loading, error } = useApi(
    () => propertyService.getFavoriteProperties(),
    { immediate: true }
  );

  const renderFavorite = ({ item }: { item: Property }) => (
    <TouchableOpacity style={styles.favoriteCard}>
      <Image source={{ uri: item.images[0] }} style={styles.favoriteImage} />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle}>{item.title}</Text>
        <Text style={styles.favoriteLocation}>
          {item.location.city}, {item.location.state}
        </Text>
        <Text style={styles.favoritePrice}>
          {formatCurrency(item.price, item.currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading favorites: {error}</Text>
      </View>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start exploring properties and add them to your favorites
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  favoriteImage: {
    width: 120,
    height: 120,
  },
  favoriteInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  favoriteLocation: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  favoritePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});
