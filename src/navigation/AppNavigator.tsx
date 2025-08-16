import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
    screenOptions={{
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Dashboard' }}
    />
                    <Tab.Screen
                  name="Messages"
                  component={ConversationsScreen}
                  options={{ title: 'Messages' }}
                />
                <Tab.Screen
                  name="Search"
                  component={HomeScreen}
                  options={{ title: 'Search' }}
                />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
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