import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NetworkStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    // Check network connectivity
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health', {
          method: 'GET',
        });
        const connected = response.ok;
        setIsConnected(connected);
        
        if (!connected && isConnected) {
          setShowSnackbar(true);
        }
      } catch (error) {
        setIsConnected(false);
        if (isConnected) {
          setShowSnackbar(true);
        }
      }
    };

    // Check connection on mount
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (isConnected) {
    return null;
  }

  return (
    <Snackbar
      visible={showSnackbar}
      onDismiss={() => setShowSnackbar(false)}
      duration={5000}
      style={styles.snackbar}
      action={{
        label: 'Retry',
        onPress: () => {
          setShowSnackbar(false);
          // Retry connection
          setIsConnected(true);
        },
      }}
    >
      <View style={styles.snackbarContent}>
        <MaterialCommunityIcons 
          name="wifi-off" 
          size={20} 
          color="white" 
          style={styles.icon}
        />
        <Text style={styles.message}>
          No internet connection. Please check your network.
        </Text>
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: '#f44336',
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: 'white',
    flex: 1,
  },
});

export default NetworkStatus;
