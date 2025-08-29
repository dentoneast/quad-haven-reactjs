import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import SideMenu from '../components/SideMenu';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import PremisesManagementScreen from '../screens/PremisesManagementScreen';
import RentalUnitsScreen from '../screens/RentalUnitsScreen';
import RentalListingsScreen from '../screens/RentalListingsScreen';
import LeaseManagementScreen from '../screens/LeaseManagementScreen';
import MyLeasesScreen from '../screens/MyLeasesScreen';
import RentPaymentsScreen from '../screens/RentPaymentsScreen';
import MaintenanceRequestsScreen from '../screens/MaintenanceRequestsScreen';
import LandlordMaintenanceScreen from '../screens/LandlordMaintenanceScreen';
import WorkmanMaintenanceScreen from '../screens/WorkmanMaintenanceScreen';
import MaintenanceDashboardScreen from '../screens/MaintenanceDashboardScreen';
import OrganizationManagementScreen from '../screens/OrganizationManagementScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchRentalsScreen from '../screens/SearchRentalsScreen';
import SavedRentalsScreen from '../screens/SavedRentalsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: '#666666',
      tabBarAllowFontScaling: false,
      tabBarPressColor: '#e0e0e0',
      tabBarPressOpacity: 0.7,
      tabBarScrollEnabled: false,
      tabBarLazy: true,
      tabBarBadge: undefined,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        try {
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        } catch (error) {
          // Fallback icon if there's any issue
          return <Ionicons name="help-outline" size={size} color={color} />;
        }
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 8,
        paddingTop: 8,
        height: 65,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      tabBarItemStyle: {
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
      },
      tabBarIconStyle: {
        marginTop: 2,
        marginBottom: 2,
      },
      tabBarBadgeStyle: {
        backgroundColor: '#ff4444',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        lineHeight: 20,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ 
        title: 'Dashboard',
        tabBarAccessibilityLabel: 'Go to Dashboard',
        tabBarTestID: 'home-tab',
      }}
    />
    <Tab.Screen
      name="Messages"
      component={ConversationsScreen}
      options={{ 
        title: 'Messages',
        tabBarAccessibilityLabel: 'View Messages',
        tabBarTestID: 'messages-tab',
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchRentalsScreen}
      options={{ 
        title: 'Search',
        tabBarAccessibilityLabel: 'Search Rentals',
        tabBarTestID: 'search-tab',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ 
        title: 'Profile',
        tabBarAccessibilityLabel: 'View Profile',
        tabBarTestID: 'profile-tab',
      }}
    />
  </Tab.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#6200ee',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    
    {/* Landlord Screens */}
    <Stack.Screen 
      name="PremisesManagement" 
      component={PremisesManagementScreen}
      options={{ title: 'Premises Management' }}
    />
    <Stack.Screen 
      name="RentalUnits" 
      component={RentalUnitsScreen}
      options={{ title: 'Rental Units' }}
    />
    <Stack.Screen 
      name="RentalListings" 
      component={RentalListingsScreen}
      options={{ title: 'Rental Listings' }}
    />
    <Stack.Screen 
      name="LeaseManagement" 
      component={LeaseManagementScreen}
      options={{ title: 'Lease Management' }}
    />
    
    <Stack.Screen 
      name="LandlordMaintenance" 
      component={LandlordMaintenanceScreen}
      options={{ title: 'Maintenance Management' }}
    />
    
    <Stack.Screen 
      name="WorkmanMaintenance" 
      component={WorkmanMaintenanceScreen}
      options={{ title: 'Work Orders' }}
    />
    
    <Stack.Screen 
      name="MaintenanceDashboard" 
      component={MaintenanceDashboardScreen}
      options={{ title: 'Maintenance Dashboard' }}
    />
    
    <Stack.Screen 
      name="OrganizationManagement" 
      component={OrganizationManagementScreen}
      options={{ title: 'Organization Management' }}
    />
    
    <Stack.Screen 
      name="Conversations" 
      component={ConversationsScreen}
      options={{ title: 'Messages' }}
    />
    
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{ title: 'Chat' }}
    />
    
    {/* Tenant Screens */}
    <Stack.Screen 
      name="MyLeases" 
      component={MyLeasesScreen}
      options={{ title: 'My Leases' }}
    />
    <Stack.Screen 
      name="RentPayments" 
      component={RentPaymentsScreen}
      options={{ title: 'Rent Payments' }}
    />
    <Stack.Screen 
      name="MaintenanceRequests" 
      component={MaintenanceRequestsScreen}
      options={{ title: 'Maintenance Requests' }}
    />
    
    {/* General Maintenance Screen for all users */}
    <Stack.Screen 
      name="GeneralMaintenance" 
      component={MaintenanceRequestsScreen}
      options={{ title: 'Maintenance' }}
    />
    
    {/* Search and Saved Rentals */}
    <Stack.Screen 
      name="SearchRentals" 
      component={SearchRentalsScreen}
      options={{ title: 'Search Rentals' }}
    />
    <Stack.Screen 
      name="SavedRentals" 
      component={SavedRentalsScreen}
      options={{ title: 'Saved Rentals' }}
    />
    
    {/* Settings and Help */}
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen 
      name="HelpSupport" 
      component={HelpSupportScreen}
      options={{ title: 'Help & Support' }}
    />
  </Stack.Navigator>
);

const MainDrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <SideMenu {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveTintColor: '#6200ee',
      drawerInactiveTintColor: '#666',
    }}
  >
    <Drawer.Screen 
      name="MainStack" 
      component={MainStackNavigator}
      options={{
        title: 'Dashboard',
      }}
    />
  </Drawer.Navigator>
);

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainDrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 