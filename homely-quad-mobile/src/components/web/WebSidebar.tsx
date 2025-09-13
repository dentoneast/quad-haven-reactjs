import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, List, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WebSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
}

const WebSidebar: React.FC<WebSidebarProps> = ({ isOpen, onClose, navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();

  const isLandlord = user?.user_type === 'landlord';
  const isWorkman = user?.user_type === 'workman';
  const isTenant = user?.user_type === 'tenant';

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Surface style={styles.sidebar}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigation</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Main</List.Subheader>
          <List.Item
            title="Dashboard"
            left={(props) => <List.Icon {...props} icon="home" />}
            onPress={() => handleNavigation('MainTabs')}
            style={styles.listItem}
          />
          <List.Item
            title="Search Rentals"
            left={(props) => <List.Icon {...props} icon="magnify" />}
            onPress={() => handleNavigation('SearchRentals')}
            style={styles.listItem}
          />
          <List.Item
            title="Saved Rentals"
            left={(props) => <List.Icon {...props} icon="heart" />}
            onPress={() => handleNavigation('SavedRentals')}
            style={styles.listItem}
          />
          <List.Item
            title="Messages"
            left={(props) => <List.Icon {...props} icon="message" />}
            onPress={() => handleNavigation('Conversations')}
            style={styles.listItem}
          />
        </List.Section>

        <Divider />

        {isLandlord && (
          <>
            <List.Section>
              <List.Subheader>Landlord Management</List.Subheader>
              <List.Item
                title="Premises"
                left={(props) => <List.Icon {...props} icon="office-building" />}
                onPress={() => handleNavigation('PremisesManagement')}
                style={styles.listItem}
              />
              <List.Item
                title="Rental Units"
                left={(props) => <List.Icon {...props} icon="home-city" />}
                onPress={() => handleNavigation('RentalUnits')}
                style={styles.listItem}
              />
              <List.Item
                title="Rental Listings"
                left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
                onPress={() => handleNavigation('RentalListings')}
                style={styles.listItem}
              />
              <List.Item
                title="Lease Management"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                onPress={() => handleNavigation('LeaseManagement')}
                style={styles.listItem}
              />
              <List.Item
                title="Maintenance"
                left={(props) => <List.Icon {...props} icon="wrench" />}
                onPress={() => handleNavigation('LandlordMaintenance')}
                style={styles.listItem}
              />
              <List.Item
                title="Organization"
                left={(props) => <List.Icon {...props} icon="account-group" />}
                onPress={() => handleNavigation('OrganizationManagement')}
                style={styles.listItem}
              />
            </List.Section>
            <Divider />
          </>
        )}

        {isTenant && (
          <>
            <List.Section>
              <List.Subheader>Tenant</List.Subheader>
              <List.Item
                title="My Leases"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                onPress={() => handleNavigation('MyLeases')}
                style={styles.listItem}
              />
              <List.Item
                title="Rent Payments"
                left={(props) => <List.Icon {...props} icon="credit-card" />}
                onPress={() => handleNavigation('RentPayments')}
                style={styles.listItem}
              />
              <List.Item
                title="Maintenance Requests"
                left={(props) => <List.Icon {...props} icon="wrench" />}
                onPress={() => handleNavigation('MaintenanceRequests')}
                style={styles.listItem}
              />
            </List.Section>
            <Divider />
          </>
        )}

        {isWorkman && (
          <>
            <List.Section>
              <List.Subheader>Workman</List.Subheader>
              <List.Item
                title="Work Orders"
                left={(props) => <List.Icon {...props} icon="clipboard-list" />}
                onPress={() => handleNavigation('WorkmanMaintenance')}
                style={styles.listItem}
              />
              <List.Item
                title="Maintenance Dashboard"
                left={(props) => <List.Icon {...props} icon="view-dashboard" />}
                onPress={() => handleNavigation('MaintenanceDashboard')}
                style={styles.listItem}
              />
            </List.Section>
            <Divider />
          </>
        )}

        <List.Section>
          <List.Subheader>Settings</List.Subheader>
          <List.Item
            title="Profile"
            left={(props) => <List.Icon {...props} icon="account" />}
            onPress={() => handleNavigation('Profile')}
            style={styles.listItem}
          />
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={() => handleNavigation('Settings')}
            style={styles.listItem}
          />
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => handleNavigation('HelpSupport')}
            style={styles.listItem}
          />
        </List.Section>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 64, // Below navbar
    left: 0,
    width: 280,
    height: '100vh',
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  listItem: {
    paddingVertical: 4,
  },
});

export default WebSidebar;
