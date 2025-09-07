import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title, Surface, useTheme } from 'react-native-paper';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <Title style={[styles.title, { color: theme.colors.onPrimary }]}>
          Settings
        </Title>
      </Surface>
      <View style={styles.content}>
        <Text>Settings coming soon...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
