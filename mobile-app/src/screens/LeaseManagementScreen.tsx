import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Title,
  Surface,
  Card,
  FAB,
  Portal,
  Modal,
  List,
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
  lessee_first_name: string;
  lessee_last_name: string;
  lessee_email: string;
  created_at: string;
}

const LeaseManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [leases, setLeases] = useState<Lease[]>([]);
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    rentalUnitId: '',
    lesseeId: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    leaseStatus: 'draft',
    termsConditions: '',
  });

  const leaseStatuses = ['draft', 'active', 'expired', 'terminated'];

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
      // const response = await api.get('/leases?role=lessor');
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
          terms_conditions: 'Standard lease terms apply',
          unit_number: 'A101',
          unit_type: '2BR',
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd',
          lessee_first_name: 'John',
          lessee_last_name: 'Doe',
          lessee_email: 'john.doe@example.com',
          created_at: '2024-01-01',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load leases');
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
        `${lease.lessee_first_name} ${lease.lessee_last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lease => lease.lease_status === statusFilter);
    }
    
    setFilteredLeases(filtered);
  };

  const resetForm = () => {
    setFormData({
      rentalUnitId: '',
      lesseeId: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
      securityDeposit: '',
      leaseStatus: 'draft',
      termsConditions: '',
    });
    setEditingLease(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (leaseData: Lease) => {
    setFormData({
      rentalUnitId: leaseData.rental_unit_id.toString(),
      lesseeId: leaseData.lessee_id.toString(),
      startDate: leaseData.start_date,
      endDate: leaseData.end_date,
      monthlyRent: leaseData.monthly_rent.toString(),
      securityDeposit: leaseData.security_deposit?.toString() || '',
      leaseStatus: leaseData.lease_status,
      termsConditions: leaseData.terms_conditions || '',
    });
    setEditingLease(leaseData);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.rentalUnitId.trim() || !formData.lesseeId.trim() || 
        !formData.startDate.trim() || !formData.endDate.trim() || !formData.monthlyRent.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingLease) {
        // TODO: Replace with actual API call
        // await api.put(`/leases/${editingLease.id}`, formData);
        Alert.alert('Success', 'Lease updated successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.post('/leases', formData);
        Alert.alert('Success', 'Lease created successfully');
      }
      
      setModalVisible(false);
      resetForm();
      loadLeases();
    } catch (error) {
      Alert.alert('Error', 'Failed to save lease');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (leaseId: number) => {
    Alert.alert(
      'Delete Lease',
      'Are you sure you want to delete this lease? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.delete(`/leases/${leaseId}`);
              Alert.alert('Success', 'Lease deleted successfully');
              loadLeases();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete lease');
            }
          },
        },
      ]
    );
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeases();
    setRefreshing(false);
  };

  if (user?.user_type !== 'landlord') {
    return (
      <View style={styles.container}>
        <Text>Access denied. This screen is for landlords only.</Text>
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
          <Title style={styles.title}>Lease Management</Title>
          <Text style={styles.subtitle}>
            Manage tenant leases and rental agreements
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
            { value: 'draft', label: 'Draft' },
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
                {lease.premises_address}
              </Text>

              <View style={styles.tenantContainer}>
                <Text style={styles.tenantTitle}>Tenant:</Text>
                <Text style={styles.tenantName}>
                  {lease.lessee_first_name} {lease.lessee_last_name}
                </Text>
                <Text style={styles.tenantEmail}>{lease.lessee_email}</Text>
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
                Created: {new Date(lease.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
            
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => openEditModal(lease)}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(lease.id)}
                icon="delete"
                textColor="#f44336"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {filteredLeases.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Leases Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No leases match your search criteria.' 
                : 'Start by creating your first lease agreement.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>
              {isEditing ? 'Edit Lease' : 'Create New Lease'}
            </Title>

            <TextInput
              label="Rental Unit ID *"
              value={formData.rentalUnitId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, rentalUnitId: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Tenant ID *"
              value={formData.lesseeId}
              onChangeText={(text) => setFormData(prev => ({ ...prev, lesseeId: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <TextInput
                label="Start Date *"
                value={formData.startDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                placeholder="YYYY-MM-DD"
              />
              <TextInput
                label="End Date *"
                value={formData.endDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Monthly Rent *"
                value={formData.monthlyRent}
                onChangeText={(text) => setFormData(prev => ({ ...prev, monthlyRent: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                left={<TextInput.Affix text="$" />}
              />
              <TextInput
                label="Security Deposit"
                value={formData.securityDeposit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, securityDeposit: text }))}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                left={<TextInput.Affix text="$" />}
              />
            </View>

            <TextInput
              label="Lease Status"
              value={formData.leaseStatus}
              onChangeText={(text) => setFormData(prev => ({ ...prev, leaseStatus: text }))}
              mode="outlined"
              style={styles.input}
              list={leaseStatuses.join(',')}
            />

            <TextInput
              label="Terms & Conditions"
              value={formData.termsConditions}
              onChangeText={(text) => setFormData(prev => ({ ...prev, termsConditions: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.modalButton}
                loading={isLoading}
                disabled={isLoading}
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={openAddModal}
      />
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
  tenantContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tenantTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tenantEmail: {
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default LeaseManagementScreen; 