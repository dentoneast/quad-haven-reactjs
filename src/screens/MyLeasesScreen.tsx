import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Title,
  Surface,
  Card,
  Chip,
  useTheme,
  Searchbar,
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface Lease {
  id: number;
  rental_unit_id: number;
  lessor_id: number;
  lessee_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit?: number;
  lease_status: string;
  terms_conditions?: string;
  unit_number: string;
  unit_type: string;
  premises_name: string;
  premises_address: string;
  city: string;
  state: string;
  lessor_first_name: string;
  lessor_last_name: string;
  lessor_email: string;
  lessor_phone?: string;
  created_at: string;
}

const MyLeasesScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [leases, setLeases] = useState<Lease[]>([]);
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    loadLeases();
  }, []);

  useEffect(() => {
    filterLeases();
  }, [searchQuery, statusFilter, leases]);

  const loadLeases = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/leases?role=lessee');
      // setLeases(response.data.leases);
      
      // Mock data for now
      setLeases([
        {
          id: 1,
          rental_unit_id: 1,
          lessor_id: 1,
          lessee_id: 2,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          monthly_rent: 1800.00,
          security_deposit: 1800.00,
          lease_status: 'active',
          terms_conditions: 'Standard lease terms apply. No pets allowed. Quiet hours from 10 PM to 8 AM.',
          unit_number: 'A101',
          unit_type: '2BR',
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd',
          city: 'Los Angeles',
          state: 'CA',
          lessor_first_name: 'Jane',
          lessor_last_name: 'Smith',
          lessor_email: 'jane.smith@example.com',
          lessor_phone: '+1-555-0101',
          created_at: '2024-01-01',
        },
      ]);
    } catch (error) {
      console.error('Failed to load leases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeases = () => {
    let filtered = leases;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(lease =>
        lease.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.premises_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lease => lease.lease_status === statusFilter);
    }
    
    setFilteredLeases(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'draft': return '#ff9800';
      case 'expired': return '#f44336';
      case 'terminated': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isLeaseExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isLeaseExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeases();
    setRefreshing(false);
  };

  if (user?.user_type !== 'tenant') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This screen is for tenants only.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <Title style={styles.title}>My Leases</Title>
          <Text style={styles.subtitle}>
            View and manage your current and past lease agreements
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search leases..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'expired', label: 'Expired' },
          ]}
          style={styles.filterButtons}
        />

        {filteredLeases.map((lease) => (
          <Card key={lease.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Lease #{lease.id}</Title>
                <View style={styles.statusContainer}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(lease.lease_status) }}
                  >
                    {getStatusLabel(lease.lease_status)}
                  </Chip>
                  {isLeaseExpired(lease.end_date) && (
                    <Chip mode="outlined" textStyle={{ color: '#f44336' }}>
                      Expired
                    </Chip>
                  )}
                  {isLeaseExpiringSoon(lease.end_date) && (
                    <Chip mode="outlined" textStyle={{ color: '#ff9800' }}>
                      Expiring Soon
                    </Chip>
                  )}
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  Unit {lease.unit_number}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {lease.unit_type}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {lease.premises_name}
                </Chip>
              </View>

              <Text style={styles.cardAddress}>
                {lease.premises_address}, {lease.city}, {lease.state}
              </Text>

              <View style={styles.landlordContainer}>
                <Text style={styles.landlordTitle}>Landlord:</Text>
                <Text style={styles.landlordName}>
                  {lease.lessor_first_name} {lease.lessor_last_name}
                </Text>
                <Text style={styles.landlordEmail}>{lease.lessor_email}</Text>
                {lease.lessor_phone && (
                  <Text style={styles.landlordPhone}>{lease.lessor_phone}</Text>
                )}
              </View>

              <View style={styles.leaseDetails}>
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>Start Date:</Text>
                  <Text style={styles.leaseValue}>
                    {new Date(lease.start_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>End Date:</Text>
                  <Text style={styles.leaseValue}>
                    {new Date(lease.end_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>Monthly Rent:</Text>
                  <Text style={styles.leaseValue}>${lease.monthly_rent.toFixed(2)}</Text>
                </View>
                {lease.security_deposit && (
                  <View style={styles.leaseDetail}>
                    <Text style={styles.leaseLabel}>Security Deposit:</Text>
                    <Text style={styles.leaseValue}>${lease.security_deposit.toFixed(2)}</Text>
                  </View>
                )}
              </View>

              {lease.terms_conditions && (
                <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>Terms & Conditions:</Text>
                  <Text style={styles.termsText}>{lease.terms_conditions}</Text>
                </View>
              )}

              <Text style={styles.createdAt}>
                Lease created: {new Date(lease.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {filteredLeases.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Leases Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No leases match your search criteria.' 
                : 'You don\'t have any active leases yet.'}
            </Text>
          </Surface>
        )}
      </ScrollView>
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
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  landlordContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  landlordTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  landlordEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  landlordPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  leaseDetails: {
    marginBottom: 16,
  },
  leaseDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaseValue: {
    fontSize: 14,
    color: '#6200ee',
  },
  termsContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  createdAt: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  emptyState: {
    margin: 32,
    padding: 32,
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default MyLeasesScreen; 