import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  DrawerContentScrollView, 
  DrawerItem, 
  DrawerItemList
} from '@react-navigation/drawer';
import { 
  Avatar,
  Title,
  Caption,
  Divider
} from 'react-native-paper';
import { 
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome5
} from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getAppName } from '../config/app';

interface SideMenuProps {
  navigation: any;
}

const SideMenu: React.FC<SideMenuProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
            <View style={styles.container}>
          <DrawerContentScrollView>
        {/* Header with user info */}
        <View style={styles.header}>
          <Avatar.Text 
            size={60} 
            label={getInitials(user?.first_name || '', user?.last_name || '')}
            style={styles.avatar}
          />
          <Title style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Title>
          <Caption style={styles.userEmail}>{user?.email}</Caption>
          <Caption style={styles.userType}>
            {user?.user_type === 'landlord' ? '🏠 Landlord' : 
             user?.user_type === 'workman' ? '🔧 Workman' : '👤 Tenant'}
          </Caption>
        </View>

        <Divider style={styles.divider} />

        {/* Main Navigation */}
        <View style={styles.section}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )}
            label="Dashboard"
            onPress={() => props.navigation.navigate('Home')}
          />
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={size} />
            )}
            label="Search Rentals"
            onPress={() => props.navigation.navigate('SearchRentals')}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="heart" color={color} size={size} />
            )}
            label="Saved Rentals"
            onPress={() => props.navigation.navigate('SavedRentals')}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Rental Management Section */}
        {user?.user_type === 'landlord' && (
          <>
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Rental Management</Title>
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="office-building" color={color} size={size} />
                )}
                label="Premises Management"
                onPress={() => props.navigation.navigate('PremisesManagement')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="home-city" color={color} size={size} />
                )}
                label="Rental Units"
                onPress={() => props.navigation.navigate('RentalUnits')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
                )}
                label="Rental Listings"
                onPress={() => props.navigation.navigate('RentalListings')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="file-document" color={color} size={size} />
                )}
                label="Lease Management"
                onPress={() => props.navigation.navigate('LeaseManagement')}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Maintenance Management Section */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Maintenance Management</Title>
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="wrench" color={color} size={size} />
                )}
                label="Maintenance Requests"
                onPress={() => props.navigation.navigate('LandlordMaintenance')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
                )}
                label="Work Orders"
                onPress={() => props.navigation.navigate('LandlordMaintenance')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="chart-line" color={color} size={size} />
                )}
                label="Maintenance Analytics"
                onPress={() => props.navigation.navigate('LandlordMaintenance')}
              />
            </View>

            <Divider style={styles.divider} />
          </>
        )}

        {/* Tenant Section */}
        {user?.user_type === 'tenant' && (
          <>
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>My Rentals</Title>
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="file-document" color={color} size={size} />
                )}
                label="My Leases"
                onPress={() => props.navigation.navigate('MyLeases')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="calendar" color={color} size={size} />
                )}
                label="Rent Payments"
                onPress={() => props.navigation.navigate('RentPayments')}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Tenant Maintenance Section */}
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Maintenance</Title>
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="wrench" color={color} size={size} />
                )}
                label="My Requests"
                onPress={() => props.navigation.navigate('MaintenanceRequests')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="clipboard-check" color={color} size={size} />
                )}
                label="Request Status"
                onPress={() => props.navigation.navigate('MaintenanceRequests')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="star" color={color} size={size} />
                )}
                label="Rate Completed Work"
                onPress={() => props.navigation.navigate('MaintenanceRequests')}
              />
            </View>

            <Divider style={styles.divider} />
          </>
        )}

        {/* Workman Section */}
        {user?.user_type === 'workman' && (
          <>
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Work Orders</Title>
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="wrench" color={color} size={size} />
                )}
                label="Maintenance Tasks"
                onPress={() => props.navigation.navigate('WorkmanMaintenance')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
                )}
                label="My Work Orders"
                onPress={() => props.navigation.navigate('WorkmanMaintenance')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="chart-line" color={color} size={size} />
                )}
                label="Performance Dashboard"
                onPress={() => props.navigation.navigate('WorkmanMaintenance')}
              />
              
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="clock-outline" color={color} size={size} />
                )}
                label="Time Tracking"
                onPress={() => props.navigation.navigate('WorkmanMaintenance')}
              />
            </View>

            <Divider style={styles.divider} />
          </>
        )}

        {/* General Section */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>General</Title>
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="message-text" color={color} size={size} />
            )}
            label="Messages"
            onPress={() => props.navigation.navigate('Messages')}
          />
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="wrench" color={color} size={size} />
            )}
            label="Maintenance Overview"
            onPress={() => props.navigation.navigate('MaintenanceDashboard')}
          />
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            )}
            label="Profile"
            onPress={() => props.navigation.navigate('Profile')}
          />
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            )}
            label="Settings"
            onPress={() => props.navigation.navigate('Settings')}
          />
          
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="help-circle" color={color} size={size} />
            )}
            label="Help & Support"
            onPress={() => props.navigation.navigate('HelpSupport')}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Logout */}
        <View style={styles.section}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            label="Logout"
            onPress={handleLogout}
          />
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Caption style={styles.appVersion}>{getAppName()} v1.0.0</Caption>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#6200ee',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 5,
  },
  userType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  section: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
  },
});

export default SideMenu; 