import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@homely-quad/shared';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PropertiesScreen from '../screens/PropertiesScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

// Rental Management Screens
import PremisesManagementScreen from '../screens/PremisesManagementScreen';
import RentalUnitsScreen from '../screens/RentalUnitsScreen';
import RentalListingsScreen from '../screens/RentalListingsScreen';
import LeaseManagementScreen from '../screens/LeaseManagementScreen';
import MyLeasesScreen from '../screens/MyLeasesScreen';
import RentPaymentsScreen from '../screens/RentPaymentsScreen';
import OrganizationManagementScreen from '../screens/OrganizationManagementScreen';

// Maintenance Screens
import MaintenanceRequestsScreen from '../screens/MaintenanceRequestsScreen';
import LandlordMaintenanceScreen from '../screens/LandlordMaintenanceScreen';
import WorkmanMaintenanceScreen from '../screens/WorkmanMaintenanceScreen';
import MaintenanceDashboardScreen from '../screens/MaintenanceDashboardScreen';

// Communication Screens
import ConversationsScreen from '../screens/ConversationsScreen';
import ChatScreen from '../screens/ChatScreen';

// Other Screens
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

// Components
import SideMenu from '../components/SideMenu';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const { user } = useAuth();
  const isLandlord = user?.user_type === 'landlord';
  const isWorkman = user?.user_type === 'workman';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Messages':
              iconName = 'message-text';
              break;
            case 'Maintenance':
              iconName = 'wrench';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'home';
          }

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Messages" component={ConversationsScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceRequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    
    {/* Property Management */}
    <Stack.Screen name="Properties" component={PropertiesScreen} />
    <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} />
    
    {/* Rental Management */}
    <Stack.Screen name="PremisesManagement" component={PremisesManagementScreen} />
    <Stack.Screen name="RentalUnits" component={RentalUnitsScreen} />
    <Stack.Screen name="RentalListings" component={RentalListingsScreen} />
    <Stack.Screen name="LeaseManagement" component={LeaseManagementScreen} />
    <Stack.Screen name="MyLeases" component={MyLeasesScreen} />
    <Stack.Screen name="RentPayments" component={RentPaymentsScreen} />
    <Stack.Screen name="OrganizationManagement" component={OrganizationManagementScreen} />
    
    {/* Maintenance */}
    <Stack.Screen name="MaintenanceRequests" component={MaintenanceRequestsScreen} />
    <Stack.Screen name="LandlordMaintenance" component={LandlordMaintenanceScreen} />
    <Stack.Screen name="WorkmanMaintenance" component={WorkmanMaintenanceScreen} />
    <Stack.Screen name="MaintenanceDashboard" component={MaintenanceDashboardScreen} />
    
    {/* Communication */}
    <Stack.Screen name="Conversations" component={ConversationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    
    {/* Other */}
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
  </Stack.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <SideMenu {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'front',
    }}
  >
    <Drawer.Screen name="Main" component={MainStack} />
  </Drawer.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;