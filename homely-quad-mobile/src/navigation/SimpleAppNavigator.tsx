import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';

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
      name="Search" 
      component={HomeScreen}
      options={{ title: 'Search' }}
    />
    <Tab.Screen 
      name="Favorites" 
      component={HomeScreen}
      options={{ title: 'Favorites' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

const MainDrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#6200ee',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      drawerActiveTintColor: '#6200ee',
      drawerInactiveTintColor: '#666',
    }}
  >
    <Drawer.Screen 
      name="MainTabs" 
      component={MainTabNavigator}
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