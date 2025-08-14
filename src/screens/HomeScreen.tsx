import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Title, Surface, Button, useTheme, FAB, Portal, Modal, List, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NetworkStatus } from '../components/NetworkStatus';
import { getAppName } from '../config/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const isLandlord = user?.user_type === 'landlord';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton} onPress={showMenu}>
              <MaterialCommunityIcons name="menu" size={24} color="#6200ee" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Title style={styles.title}>Welcome to {getAppName()}</Title>
              <Text style={styles.subtitle}>
                Hello, {user?.first_name}! Ready to find your next rental?
              </Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <Button
            mode="contained"
            style={styles.button}
            icon="magnify"
          >
            Search Rentals
          </Button>
          <Button
            mode="outlined"
            style={styles.button}
            icon="heart"
          >
            Saved Rentals
          </Button>
          <Button
            mode="outlined"
            style={styles.button}
            icon="calendar"
          >
            View Appointments
          </Button>
        </Surface>

        {/* Rental Management Section for Landlords */}
        {isLandlord && (
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>Rental Management</Title>
            <View style={styles.gridContainer}>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('PremisesManagement')}
              >
                <MaterialCommunityIcons name="office-building" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Premises</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('RentalUnits')}
              >
                <MaterialCommunityIcons name="home-city" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Rental Units</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('RentalListings')}
              >
                <MaterialCommunityIcons name="format-list-bulleted" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Listings</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('LeaseManagement')}
              >
                <MaterialCommunityIcons name="file-document" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Leases</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('OrganizationManagement')}
              >
                <MaterialCommunityIcons name="office-building" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Organization</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('Conversations')}
              >
                <MaterialCommunityIcons name="chat" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Messages</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        )}

        {/* Tenant Section */}
        {!isLandlord && (
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>My Rentals</Title>
            <View style={styles.gridContainer}>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('MyLeases')}
              >
                <MaterialCommunityIcons name="file-document" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>My Leases</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('RentPayments')}
              >
                <MaterialCommunityIcons name="calendar" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Rent Payments</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigation.navigate('MaintenanceRequests')}
              >
                <MaterialCommunityIcons name="wrench" size={32} color="#6200ee" />
                <Text style={styles.gridItemText}>Maintenance</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        )}

        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Recent Activity</Title>
          <Text style={styles.text}>No recent activity to show.</Text>
          <Text style={styles.text}>Start by searching for rentals in your area!</Text>
        </Surface>

        <NetworkStatus />
      </ScrollView>

      {/* Slide-out Menu Modal */}
      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={hideMenu}
          contentContainerStyle={styles.menuContainer}
        >
          <View style={styles.menuHeader}>
            <Title style={styles.menuTitle}>Menu</Title>
            <TouchableOpacity onPress={hideMenu}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Divider style={styles.menuDivider} />
          
          <List.Item
            title="Dashboard"
            left={(props) => <List.Icon {...props} icon="home" />}
            onPress={hideMenu}
          />
          
          <List.Item
            title="Search Rentals"
            left={(props) => <List.Icon {...props} icon="magnify" />}
            onPress={hideMenu}
          />
          
          <List.Item
            title="Saved Rentals"
            left={(props) => <List.Icon {...props} icon="heart" />}
            onPress={hideMenu}
          />

          {isLandlord && (
            <>
              <Divider style={styles.menuDivider} />
              <List.Item
                title="Premises Management"
                left={(props) => <List.Icon {...props} icon="office-building" />}
                onPress={hideMenu}
              />
              <List.Item
                title="Rental Units"
                left={(props) => <List.Icon {...props} icon="home-city" />}
                onPress={hideMenu}
              />
              <List.Item
                title="Rental Listings"
                left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
                onPress={hideMenu}
              />
              <List.Item
                title="Lease Management"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                onPress={hideMenu}
              />
            </>
          )}

          {!isLandlord && (
            <>
              <Divider style={styles.menuDivider} />
              <List.Item
                title="My Leases"
                left={(props) => <List.Icon {...props} icon="file-document" />}
                onPress={hideMenu}
              />
              <List.Item
                title="Rent Payments"
                left={(props) => <List.Icon {...props} icon="calendar" />}
                onPress={hideMenu}
              />
              <List.Item
                title="Maintenance Requests"
                left={(props) => <List.Icon {...props} icon="wrench" />}
                onPress={hideMenu}
              />
            </>
          )}

          <Divider style={styles.menuDivider} />
          
          <List.Item
            title="Profile"
            left={(props) => <List.Icon {...props} icon="account" />}
            onPress={hideMenu}
          />
          
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={hideMenu}
          />
          
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={hideMenu}
          />
        </Modal>
      </Portal>
    </View>
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
    padding: 24,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    padding: 8,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  gridItemText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuDivider: {
    marginVertical: 8,
  },
});

export default HomeScreen; 