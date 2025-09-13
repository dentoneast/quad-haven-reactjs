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
import { useAuth } from '@homely-quad/shared';
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

  const getRoleIcon = () => {
    switch (user?.user_type) {
      case 'landlord':
        return '🏢';
      case 'workman':
        return '🔧';
      case 'admin':
        return '👑';
      default:
        return '🏠';
    }
  };

  const getRoleColor = () => {
    switch (user?.user_type) {
      case 'landlord':
        return '#4CAF50';
      case 'workman':
        return '#FF9800';
      case 'admin':
        return '#9C27B0';
      default:
        return '#2196F3';
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Home',
        icon: 'home',
        onPress: () => navigation.navigate('MainTabs'),
      },
      {
        label: 'Search Rentals',
        icon: 'magnify',
        onPress: () => navigation.navigate('SearchRentals'),
      },
      {
        label: 'Messages',
        icon: 'message-text',
        onPress: () => navigation.navigate('Conversations'),
      },
      {
        label: 'Maintenance',
        icon: 'wrench',
        onPress: () => navigation.navigate('MaintenanceRequests'),
      },
    ];

    if (user?.user_type === 'landlord') {
      return [
        ...baseItems,
        { label: '---', icon: '', onPress: () => {} },
        {
          label: 'Property Management',
          icon: 'office-building',
          onPress: () => navigation.navigate('PremisesManagement'),
        },
        {
          label: 'Rental Listings',
          icon: 'home-variant',
          onPress: () => navigation.navigate('RentalListings'),
        },
        {
          label: 'Lease Management',
          icon: 'file-document',
          onPress: () => navigation.navigate('LeaseManagement'),
        },
        {
          label: 'Organization',
          icon: 'domain',
          onPress: () => navigation.navigate('OrganizationManagement'),
        },
      ];
    }

    if (user?.user_type === 'workman') {
      return [
        ...baseItems,
        { label: '---', icon: '', onPress: () => {} },
        {
          label: 'Work Orders',
          icon: 'clipboard-list',
          onPress: () => navigation.navigate('WorkmanMaintenance'),
        },
        {
          label: 'Performance',
          icon: 'chart-line',
          onPress: () => navigation.navigate('WorkmanMaintenance'),
        },
      ];
    }

    return [
      ...baseItems,
      { label: '---', icon: '', onPress: () => {} },
      {
        label: 'My Leases',
        icon: 'file-document',
        onPress: () => navigation.navigate('MyLeases'),
      },
      {
        label: 'Rent Payments',
        icon: 'credit-card',
        onPress: () => navigation.navigate('RentPayments'),
      },
      {
        label: 'Saved Rentals',
        icon: 'heart',
        onPress: () => navigation.navigate('Favorites'),
      },
    ];
  };

  const menuItems = getMenuItems();

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
          <Caption style={styles.userEmail}>
            {user?.email}
          </Caption>
          <View style={styles.roleContainer}>
            <Title style={[styles.roleText, { color: getRoleColor() }]}>
              {getRoleIcon()} {user?.user_type?.charAt(0).toUpperCase()}{user?.user_type?.slice(1)}
            </Title>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            if (item.label === '---') {
              return <Divider key={index} style={styles.menuDivider} />;
            }

            return (
              <DrawerItem
                key={index}
                label={item.label}
                icon={({ color, size }) => (
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={size} 
                    color={color} 
                  />
                )}
                onPress={item.onPress}
                style={styles.menuItem}
              />
            );
          })}
        </View>

        <Divider style={styles.divider} />

        {/* App Info */}
        <View style={styles.appInfo}>
          <Caption style={styles.appName}>
            {getAppName()} v1.0.0
          </Caption>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <DrawerItem
          label="Sign Out"
          icon={({ color, size }) => (
            <MaterialCommunityIcons 
              name="logout" 
              size={size} 
              color={color} 
            />
          )}
          onPress={handleLogout}
          style={styles.logoutItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleContainer: {
    marginTop: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    marginVertical: 2,
  },
  menuDivider: {
    marginVertical: 8,
  },
  appInfo: {
    padding: 16,
    alignItems: 'center',
  },
  appName: {
    fontSize: 12,
    opacity: 0.6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutItem: {
    marginVertical: 4,
  },
});

export default SideMenu;
