import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { usePlatform } from '../hooks/usePlatform';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

const MainTabNavigator = () => {
  const { isWeb } = usePlatform();
  
  // On web, don't show bottom tabs - navigation is handled by top navbar and sidebar
  if (isWeb) {
    return <HomeScreen />;
  }

  return (
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
};

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;