import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRoleGuard } from '@rently/shared';

interface RoleGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

export default function RoleGuard({ 
  permission, 
  children, 
  fallback, 
  showAccessDenied = true 
}: RoleGuardProps) {
  const hasPermission = useRoleGuard(permission as any);

  if (hasPermission) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedText}>
          You don't have permission to access this feature.
        </Text>
        <Button 
          mode="outlined" 
          onPress={() => {}} 
          style={styles.contactButton}
        >
          Contact Administrator
        </Button>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    borderColor: '#007AFF',
  },
});

