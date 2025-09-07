import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Title, Surface, Button, useTheme, IconButton } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getResponsivePadding, getContainerMaxWidth } from '../../utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WebNavigationProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const WebNavigation: React.FC<WebNavigationProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <Surface style={styles.navbar}>
      <View style={[styles.container, { maxWidth: getContainerMaxWidth() }]}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={onMenuToggle} style={styles.menuButton}>
            <MaterialCommunityIcons 
              name={isMenuOpen ? 'close' : 'menu'} 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
          <Title style={styles.logo}>Rently</Title>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userType}>
            {user?.user_type?.charAt(0).toUpperCase() + user?.user_type?.slice(1)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <IconButton
            icon="bell-outline"
            size={24}
            onPress={() => {}}
            style={styles.iconButton}
          />
          <IconButton
            icon="account-circle"
            size={24}
            onPress={() => {}}
            style={styles.iconButton}
          />
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={theme.colors.error}
          >
            Logout
          </Button>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  navbar: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsivePadding(),
    height: 64,
    marginHorizontal: 'auto',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginHorizontal: 4,
  },
  logoutButton: {
    marginLeft: 16,
    borderColor: '#ff4444',
  },
});

export default WebNavigation;
