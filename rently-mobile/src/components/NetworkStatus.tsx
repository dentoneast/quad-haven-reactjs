import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { getApiUrl } from '../config/api';

interface NetworkStatusProps {
  onConnectionTest?: (isConnected: boolean) => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onConnectionTest }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch(getApiUrl('/health'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsConnected(true);
        onConnectionTest?.(true);
        Alert.alert('✅ Connection Successful', 'Server is reachable!');
      } else {
        setIsConnected(false);
        onConnectionTest?.(false);
        Alert.alert('❌ Connection Failed', 'Server responded but with an error.');
      }
    } catch (error) {
      setIsConnected(false);
      onConnectionTest?.(false);
      
      if (error instanceof Error && error.message === 'Network request failed') {
        Alert.alert(
          '🌐 Network Connection Failed',
          'Cannot reach the server. Please check:\n\n' +
          '• Server is running (npm run dev)\n' +
          '• Network configuration\n' +
          '• Firewall settings\n\n' +
          'For Android emulator, use: 10.0.2.2:3000\n' +
          'For physical devices, use your computer\'s IP address'
        );
      } else {
        Alert.alert('❌ Connection Error', error instanceof Error ? error.message : 'Unknown error');
      }
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return '#FFA500'; // Orange for unknown
    return isConnected ? '#4CAF50' : '#F44336'; // Green for connected, Red for disconnected
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Testing...';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Network Status</Title>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <Paragraph style={styles.apiUrl}>
          API URL: {getApiUrl('')}
        </Paragraph>
        <Button
          mode="contained"
          onPress={testConnection}
          loading={isTesting}
          disabled={isTesting}
          style={styles.testButton}
        >
          Test Connection
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  apiUrl: {
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  testButton: {
    marginTop: 8,
  },
}); 