import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Title, Surface, Button, useTheme, FAB, Portal, Modal, List, Divider } from 'react-native-paper';
import { useAuth } from '@homely-quad/shared';
import NetworkStatus from '../components/NetworkStatus';
import { getAppName } from '../config/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { usePlatform } from '../hooks/usePlatform';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { isDesktop } from '../utils/responsive';

type RootStackParamList = {
  PremisesManagement: undefined;
  RentalUnits: undefined;
  RentalListings: undefined;
  LeaseManagement: undefined;
  OrganizationManagement: undefined;
  Conversations: undefined;
  MyLeases: undefined;
  RentPayments: undefined;
  MaintenanceRequests: undefined;
  WorkmanMaintenance: undefined;
  SearchRentals: undefined;
  SavedRentals: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type HomeScreenDrawerProp = DrawerNavigationProp<any>;

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const drawerNavigation = useNavigation<HomeScreenDrawerProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);
  const openDrawer = () => drawerNavigation.openDrawer();

  const isLandlord = user?.user_type === 'landlord';
  const isWorkman = user?.user_type === 'workman';

  const { isWeb } = usePlatform();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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

  const getQuickActions = () => {
    const baseActions = [
      {
        title: 'Search Rentals',
        icon: 'magnify',
        onPress: () => navigation.navigate('SearchRentals'),
        color: '#2196F3',
      },
      {
        title: 'Messages',
        icon: 'message-text',
        onPress: () => navigation.navigate('Conversations'),
        color: '#4CAF50',
      },
      {
        title: 'Maintenance',
        icon: 'wrench',
        onPress: () => navigation.navigate('MaintenanceRequests'),
        color: '#FF9800',
      },
    ];

    if (isLandlord) {
      return [
        ...baseActions,
        {
          title: 'Manage Properties',
          icon: 'office-building',
          onPress: () => navigation.navigate('PremisesManagement'),
          color: '#9C27B0',
        },
        {
          title: 'Rental Listings',
          icon: 'home-variant',
          onPress: () => navigation.navigate('RentalListings'),
          color: '#607D8B',
        },
        {
          title: 'Lease Management',
          icon: 'file-document',
          onPress: () => navigation.navigate('LeaseManagement'),
          color: '#795548',
        },
      ];
    }

    if (isWorkman) {
      return [
        ...baseActions,
        {
          title: 'My Work Orders',
          icon: 'clipboard-list',
          onPress: () => navigation.navigate('WorkmanMaintenance'),
          color: '#FF5722',
        },
        {
          title: 'Performance',
          icon: 'chart-line',
          onPress: () => navigation.navigate('WorkmanMaintenance'),
          color: '#3F51B5',
        },
      ];
    }

    return [
      ...baseActions,
      {
        title: 'My Leases',
        icon: 'file-document',
        onPress: () => navigation.navigate('MyLeases'),
        color: '#795548',
      },
      {
        title: 'Rent Payments',
        icon: 'credit-card',
        onPress: () => navigation.navigate('RentPayments'),
        color: '#4CAF50',
      },
      {
        title: 'Saved Rentals',
        icon: 'heart',
        onPress: () => navigation.navigate('SavedRentals'),
        color: '#E91E63',
      },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <ResponsiveLayout>
      <View style={styles.container}>
        <NetworkStatus />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
            <View style={styles.headerContent}>
              <View style={styles.welcomeSection}>
                <Text style={[styles.greeting, { color: theme.colors.onPrimary }]}>
                  {getGreeting()}
                </Text>
                <Title style={[styles.userName, { color: theme.colors.onPrimary }]}>
                  {user?.first_name} {user?.last_name}
                </Title>
                <View style={styles.roleContainer}>
                  <Text style={[styles.roleIcon, { color: getRoleColor() }]}>
                    {getRoleIcon()}
                  </Text>
                  <Text style={[styles.roleText, { color: theme.colors.onPrimary }]}>
                    {user?.user_type?.charAt(0).toUpperCase()}{user?.user_type?.slice(1)}
                  </Text>
                </View>
              </View>
              
              {!isWeb && (
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                  <MaterialCommunityIcons 
                    name="menu" 
                    size={24} 
                    color={theme.colors.onPrimary} 
                  />
                </TouchableOpacity>
              )}
            </View>
          </Surface>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Title>
            
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                  onPress={action.onPress}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <MaterialCommunityIcons name={action.icon as any} size={24} color="white" />
                  </View>
                  <Text style={[styles.actionTitle, { color: theme.colors.onSurface }]}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivityContainer}>
            <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Activity
            </Title>
            
            <Surface style={[styles.activityCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <List.Item
                title="Welcome to Rently"
                description="Get started by exploring your dashboard"
                left={(props) => <List.Icon {...props} icon="information" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
              <Divider />
              <List.Item
                title="Complete Your Profile"
                description="Add more details to your profile"
                left={(props) => <List.Icon {...props} icon="account-edit" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            </Surface>
          </View>

          {/* App Info */}
          <View style={styles.appInfoContainer}>
            <Text style={[styles.appInfo, { color: theme.colors.onSurface }]}>
              {getAppName()} v1.0.0
            </Text>
          </View>
        </ScrollView>

        {/* FAB for mobile */}
        {!isWeb && (
          <FAB
            icon="plus"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              // Default action based on user type
              if (isLandlord) {
                navigation.navigate('PremisesManagement');
              } else if (isWorkman) {
                navigation.navigate('WorkmanMaintenance');
              } else {
                navigation.navigate('SearchRentals');
              }
            }}
          />
        )}
      </View>
    </ResponsiveLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuButton: {
    padding: 8,
    marginTop: -8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  appInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  appInfo: {
    fontSize: 12,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;