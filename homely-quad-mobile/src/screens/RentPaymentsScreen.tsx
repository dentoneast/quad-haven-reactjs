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
  Button,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface RentPayment {
  id: number;
  lease_id: number;
  amount: number;
  due_date: string;
  paid_date?: string;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  unit_number: string;
  premises_name: string;
  monthly_rent: number;
  created_at: string;
}

const RentPaymentsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<RentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchQuery, statusFilter, payments]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/rent-payments?role=lessee');
      // setPayments(response.data.payments);
      
      // Mock data for now
      setPayments([
        {
          id: 1,
          lease_id: 1,
          amount: 1800.00,
          due_date: '2024-01-01',
          paid_date: '2024-01-01',
          payment_status: 'paid',
          payment_method: 'Bank Transfer',
          transaction_id: 'TXN123456',
          unit_number: 'A101',
          premises_name: 'Sunset Gardens Apartments',
          monthly_rent: 1800.00,
          created_at: '2024-01-01',
        },
        {
          id: 2,
          lease_id: 1,
          amount: 1800.00,
          due_date: '2024-02-01',
          paid_date: '2024-02-01',
          payment_status: 'paid',
          payment_method: 'Bank Transfer',
          transaction_id: 'TXN123457',
          unit_number: 'A101',
          premises_name: 'Sunset Gardens Apartments',
          monthly_rent: 1800.00,
          created_at: '2024-02-01',
        },
        {
          id: 3,
          lease_id: 1,
          amount: 1800.00,
          due_date: '2024-03-01',
          paid_date: undefined,
          payment_status: 'pending',
          payment_method: undefined,
          transaction_id: undefined,
          unit_number: 'A101',
          premises_name: 'Sunset Gardens Apartments',
          monthly_rent: 1800.00,
          created_at: '2024-03-01',
        },
      ]);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(payment =>
        payment.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.premises_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'overdue': return '#f44336';
      case 'failed': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isPaymentOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isPaymentDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue > 0;
  };

  const handleMakePayment = (payment: RentPayment) => {
    // TODO: Implement payment processing
    console.log('Making payment for:', payment);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
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
          <Title style={styles.title}>Rent Payments</Title>
          <Text style={styles.subtitle}>
            Track your rent payment history and upcoming payments
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search payments..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'overdue', label: 'Overdue' },
          ]}
          style={styles.filterButtons}
        />

        {filteredPayments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Payment #{payment.id}</Title>
                <View style={styles.statusContainer}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(payment.payment_status) }}
                  >
                    {getStatusLabel(payment.payment_status)}
                  </Chip>
                  {isPaymentOverdue(payment.due_date) && (
                    <Chip mode="outlined" textStyle={{ color: '#f44336' }}>
                      Overdue
                    </Chip>
                  )}
                  {isPaymentDueSoon(payment.due_date) && !payment.paid_date && (
                    <Chip mode="outlined" textStyle={{ color: '#ff9800' }}>
                      Due Soon
                    </Chip>
                  )}
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  Unit {payment.unit_number}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {payment.premises_name}
                </Chip>
              </View>

              <View style={styles.paymentDetails}>
                <View style={styles.paymentDetail}>
                  <Text style={styles.paymentLabel}>Amount Due:</Text>
                  <Text style={styles.paymentValue}>${payment.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.paymentDetail}>
                  <Text style={styles.paymentLabel}>Due Date:</Text>
                  <Text style={[
                    styles.paymentValue,
                    isPaymentOverdue(payment.due_date) && styles.overdueText
                  ]}>
                    {new Date(payment.due_date).toLocaleDateString()}
                  </Text>
                </View>
                {payment.paid_date && (
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentLabel}>Paid Date:</Text>
                    <Text style={styles.paymentValue}>
                      {new Date(payment.paid_date).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {payment.payment_method && (
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentLabel}>Payment Method:</Text>
                    <Text style={styles.paymentValue}>{payment.payment_method}</Text>
                  </View>
                )}
                {payment.transaction_id && (
                  <View style={styles.paymentDetail}>
                    <Text style={styles.paymentLabel}>Transaction ID:</Text>
                    <Text style={styles.paymentValue}>{payment.transaction_id}</Text>
                  </View>
                )}
              </View>

              {payment.payment_status === 'pending' && (
                <View style={styles.actionContainer}>
                  <Button
                    mode="contained"
                    onPress={() => handleMakePayment(payment)}
                    icon="credit-card"
                    style={styles.payButton}
                  >
                    Make Payment
                  </Button>
                </View>
              )}

              <Text style={styles.createdAt}>
                Created: {new Date(payment.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {filteredPayments.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="credit-card" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Payments Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No payments match your search criteria.' 
                : 'You don\'t have any rent payments yet.'}
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
  paymentDetails: {
    marginBottom: 16,
  },
  paymentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentValue: {
    fontSize: 14,
    color: '#6200ee',
  },
  overdueText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  actionContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#4caf50',
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

export default RentPaymentsScreen; 