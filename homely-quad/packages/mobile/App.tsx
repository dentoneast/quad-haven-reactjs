import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@homely-quad/shared';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could add a loading screen component here
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator isAuthenticated={isAuthenticated} />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
