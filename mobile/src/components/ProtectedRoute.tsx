import React from 'react';
import { useAuth } from '@rently/shared';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.subtitle}>
          Please log in to access this feature.
        </Text>
        <Button 
          mode="contained" 
          onPress={() => {}} 
          style={styles.loginButton}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  if (requiredRole) {
    const userRole = user?.user_type;
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.subtitle}>
            You don't have the required permissions to access this feature.
          </Text>
          <Text style={styles.roleInfo}>
            Required role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
          </Text>
          <Text style={styles.roleInfo}>
            Your role: {userRole || 'Unknown'}
          </Text>
        </View>
      );
    }
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  roleInfo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
});

