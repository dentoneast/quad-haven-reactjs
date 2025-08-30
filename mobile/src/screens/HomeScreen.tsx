import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Rently</Text>
          <Text style={styles.subtitle}>Your rental management solution</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Quick Actions</Title>
              <Paragraph>Manage your properties and rentals</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => {}}>
                View Properties
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Recent Activity</Title>
              <Paragraph>No recent activity to display</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Maintenance Requests</Title>
              <Paragraph>No pending maintenance requests</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="outlined" onPress={() => {}}>
                Create Request
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
});
