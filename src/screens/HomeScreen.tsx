import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Surface, Button, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NetworkStatus } from '../components/NetworkStatus';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.title}>Welcome to Rently</Title>
        <Text style={styles.subtitle}>
          Hello, {user?.first_name}! Ready to find your next rental?
        </Text>
      </Surface>

      <Surface style={styles.section}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        <Button
          mode="contained"
          style={styles.button}
          icon="magnify"
        >
          Search Rentals
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          icon="heart"
        >
          Saved Rentals
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          icon="calendar"
        >
          View Appointments
        </Button>
      </Surface>

      <Surface style={styles.section}>
        <Title style={styles.sectionTitle}>Recent Activity</Title>
        <Text style={styles.text}>No recent activity to show.</Text>
        <Text style={styles.text}>Start by searching for rentals in your area!</Text>
      </Surface>

      <NetworkStatus />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
});

export default HomeScreen; 