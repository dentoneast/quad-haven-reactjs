import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Title,
  Surface,
  Card,
  Chip,
  useTheme,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  List,
  Searchbar,
  SegmentedButtons,
  Divider,
  DataTable,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  request_type: string;
  priority: string;
  status: string;
  premises_name: string;
  premises_address: string;
  unit_number?: string;
  estimated_cost?: number;
  actual_cost?: number;
  requested_date: string;
  approved_date?: string;
  assigned_date?: string;
  started_date?: string;
  completed_date?: string;
  tenant_first_name: string;
  tenant_last_name: string;
  tenant_email: string;
  tenant_phone: string;
  work_order_number?: string;
  work_order_status?: string;
  workman_first_name?: string;
  workman_last_name?: string;
}

interface Workman {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialties: string[];
}

const LandlordMaintenanceScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [availableWorkmen, setAvailableWorkmen] = useState<Workman[]>([]);
  
  const [workOrderData, setWorkOrderData] = useState({
    workman_id: '',
    work_description: '',
    estimated_hours: '',
    materials_required: '',
    special_instructions: '',
  });

  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const priorities = [
    { value: 'all', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  useEffect(() => {
    loadMaintenanceRequests();
    loadAvailableWorkmen();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, priorityFilter, maintenanceRequests]);

  const loadMaintenanceRequests = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/maintenance-requests');
      // setMaintenanceRequests(response.data.maintenance_requests);
      
      // Mock data for now
      setMaintenanceRequests([
        {
          id: 1,
          title: 'Leaky Kitchen Faucet',
          description: 'The kitchen faucet is dripping constantly and needs repair. Water is accumulating under the sink.',
          request_type: 'routine',
          priority: 'medium',
          status: 'completed',
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd, Los Angeles, CA 90210',
          unit_number: '101',
          estimated_cost: 150.00,
          actual_cost: 145.00,
          requested_date: '2024-01-15T10:00:00Z',
          approved_date: '2024-01-16T09:00:00Z',
          assigned_date: '2024-01-17T08:00:00Z',
          started_date: '2024-01-18T09:00:00Z',
          completed_date: '2024-01-18T14:00:00Z',
          tenant_first_name: 'John',
          tenant_last_name: 'Doe',
          tenant_email: 'john.doe@example.com',
          tenant_phone: '+1-555-0101',
          work_order_number: 'WO-2024-001',
          work_order_status: 'completed',
          workman_first_name: 'Tom',
          workman_last_name: 'Anderson',
        },
        {
          id: 2,
          title: 'Broken Window Lock',
          description: 'The lock on the bedroom window is broken and won\'t secure properly. This is a security concern.',
          request_type: 'urgent',
          priority: 'high',
          status: 'in_progress',
          premises_name: 'Sunset Gardens Apartments',
          premises_address: '123 Sunset Blvd, Los Angeles, CA 90210',
          unit_number: '202',
          estimated_cost: 75.00,
          requested_date: '2024-01-20T14:00:00Z',
          approved_date: '2024-01-20T16:00:00Z',
          assigned_date: '2024-01-21T09:00:00Z',
          started_date: '2024-01-21T10:00:00Z',
          tenant_first_name: 'Mike',
          tenant_last_name: 'Johnson',
          tenant_email: 'mike.johnson@example.com',
          tenant_phone: '+1-555-0103',
          work_order_number: 'WO-2024-002',
          work_order_status: 'in_progress',
          workman_first_name: 'Tom',
          workman_last_name: 'Anderson',
        },
        {
          id: 3,
          title: 'HVAC System Not Working',
          description: 'The air conditioning unit is not cooling properly. It makes strange noises and only blows warm air.',
          request_type: 'emergency',
          priority: 'critical',
          status: 'pending',
          premises_name: 'Downtown Lofts',
          premises_address: '456 Main Street, Chicago, IL 60601',
          unit_number: 'A1',
          estimated_cost: 300.00,
          requested_date: '2024-01-22T08:00:00Z',
          tenant_first_name: 'David',
          tenant_last_name: 'Brown',
          tenant_email: 'david.brown@example.com',
          tenant_phone: '+1-555-0105',
        },
      ]);
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
      Alert.alert('Error', 'Failed to load maintenance requests');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableWorkmen = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/users?user_type=workman');
      // setAvailableWorkmen(response.data.users);
      
      // Mock data for now
      setAvailableWorkmen([
        {
          id: 9,
          first_name: 'Tom',
          last_name: 'Anderson',
          email: 'tom.anderson@example.com',
          phone: '+1-555-0111',
          specialties: ['plumbing', 'electrical', 'general'],
        },
        {
          id: 10,
          first_name: 'Bob',
          last_name: 'Wilson',
          email: 'bob.wilson@example.com',
          phone: '+1-555-0112',
          specialties: ['hvac', 'appliances'],
        },
      ]);
    } catch (error) {
      console.error('Failed to load workmen:', error);
    }
  };

  const filterRequests = () => {
    let filtered = maintenanceRequests;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.premises_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${request.tenant_first_name} ${request.tenant_last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApproveRequest = async (requestId: number, approved: boolean, comments?: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put(`/maintenance-requests/${requestId}/approve`, {
      //   status: approved ? 'approved' : 'rejected',
      //   comments
      // });
      
      // Mock success
      await loadMaintenanceRequests();
      Alert.alert('Success', `Request ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Failed to update request status:', error);
      Alert.alert('Error', 'Failed to update request status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignWorkOrder = async () => {
    if (!selectedRequest || !workOrderData.workman_id || !workOrderData.work_description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post(`/maintenance-requests/${selectedRequest.id}/assign`, workOrderData);
      
      // Mock success
      setModalVisible(false);
      setWorkOrderData({
        workman_id: '',
        work_description: '',
        estimated_hours: '',
        materials_required: '',
        special_instructions: '',
      });
      await loadMaintenanceRequests();
      Alert.alert('Success', 'Work order assigned successfully');
    } catch (error) {
      console.error('Failed to assign work order:', error);
      Alert.alert('Error', 'Failed to assign work order');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#2196f3';
      case 'assigned': return '#9c27b0';
      case 'in_progress': return '#ff5722';
      case 'completed': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaintenanceRequests();
    setRefreshing(false);
  };

  const openAssignModal = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const navigateToDetails = (request: MaintenanceRequest) => {
    navigation.navigate('MaintenanceRequestDetails' as never, { requestId: request.id } as never);
  };

  const getRequestCountByStatus = () => {
    const counts: { [key: string]: number } = {};
    statuses.forEach(status => {
      if (status.value !== 'all') {
        counts[status.value] = maintenanceRequests.filter(req => req.status === status.value).length;
      }
    });
    return counts;
  };

  const getTotalCost = () => {
    return maintenanceRequests
      .filter(req => req.actual_cost)
      .reduce((sum, req) => sum + (req.actual_cost || 0), 0);
  };

  const getAverageResponseTime = () => {
    const completedRequests = maintenanceRequests.filter(req => req.completed_date && req.approved_date);
    if (completedRequests.length === 0) return 0;
    
    const totalDays = completedRequests.reduce((sum, req) => {
      const approved = new Date(req.approved_date!);
      const completed = new Date(req.completed_date!);
      return sum + Math.ceil((completed.getTime() - approved.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    
    return Math.round(totalDays / completedRequests.length);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Surface style={styles.header}>
          <Title style={styles.title}>Maintenance Management</Title>
          <Text style={styles.subtitle}>
            Manage maintenance requests and work orders for your properties
          </Text>
        </Surface>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{maintenanceRequests.length}</Title>
              <Text style={styles.statLabel}>Total Requests</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>${getTotalCost()}</Title>
              <Text style={styles.statLabel}>Total Cost</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{getAverageResponseTime()}</Title>
              <Text style={styles.statLabel}>Avg Days</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Status Summary */}
        <Surface style={styles.statusSummary}>
          <Title style={styles.sectionTitle}>Request Status Summary</Title>
          <View style={styles.statusGrid}>
            {statuses.filter(s => s.value !== 'all').map(status => (
              <View key={status.value} style={styles.statusItem}>
                <Text style={styles.statusCount}>{getRequestCountByStatus()[status.value] || 0}</Text>
                <Text style={styles.statusName}>{status.label}</Text>
              </View>
            ))}
          </View>
        </Surface>

        <Searchbar
          placeholder="Search requests, properties, or tenants..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.filtersContainer}>
          <SegmentedButtons
            value={statusFilter}
            onValueChange={setStatusFilter}
            buttons={statuses.map(status => ({ value: status.value, label: status.label }))}
            style={styles.filterButtons}
          />
          
          <SegmentedButtons
            value={priorityFilter}
            onValueChange={setPriorityFilter}
            buttons={priorities.map(priority => ({ value: priority.value, label: priority.label }))}
            style={styles.filterButtons}
          />
        </View>

        {filteredRequests.map((request) => (
          <TouchableOpacity
            key={request.id}
            onPress={() => navigateToDetails(request)}
            style={styles.requestTouchable}
          >
            <Card style={styles.requestCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.requestTitle}>{request.title}</Title>
                  <View style={styles.statusContainer}>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(request.status) }}
                      style={styles.statusChip}
                    >
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Chip>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getPriorityColor(request.priority) }}
                      style={styles.priorityChip}
                    >
                      {request.priority.toUpperCase()}
                    </Chip>
                  </View>
                </View>

                <Text style={styles.description}>{request.description}</Text>

                <View style={styles.requestInfo}>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="office-building" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {request.premises_name} {request.unit_number && `- Unit ${request.unit_number}`}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {request.tenant_first_name} {request.tenant_last_name}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone" size={16} color="#666" />
                    <Text style={styles.infoText}>{request.tenant_phone}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email" size={16} color="#666" />
                    <Text style={styles.infoText}>{request.tenant_email}</Text>
                  </View>
                </View>

                <View style={styles.timeline}>
                  <Text style={styles.timelineLabel}>Requested: {formatDate(request.requested_date)}</Text>
                  
                  {request.approved_date && (
                    <Text style={styles.timelineLabel}>Approved: {formatDate(request.approved_date)}</Text>
                  )}
                  
                  {request.assigned_date && (
                    <Text style={styles.timelineLabel}>Assigned: {formatDate(request.assigned_date)}</Text>
                  )}
                  
                  {request.started_date && (
                    <Text style={styles.timelineLabel}>Started: {formatDate(request.started_date)}</Text>
                  )}
                  
                  {request.completed_date && (
                    <Text style={styles.timelineLabel}>Completed: {formatDate(request.completed_date)}</Text>
                  )}
                </View>

                {request.estimated_cost && (
                  <View style={styles.costInfo}>
                    <Text style={styles.costLabel}>Estimated Cost: ${request.estimated_cost}</Text>
                    {request.actual_cost && (
                      <Text style={styles.costLabel}>Actual Cost: ${request.actual_cost}</Text>
                    )}
                  </View>
                )}

                {request.work_order_number && (
                  <View style={styles.workOrderInfo}>
                    <Text style={styles.workOrderLabel}>Work Order: {request.work_order_number}</Text>
                    {request.workman_first_name && (
                      <Text style={styles.workmanInfo}>
                        Assigned to: {request.workman_first_name} {request.workman_last_name}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.actionButtons}>
                  {request.status === 'pending' && (
                    <>
                      <Button
                        mode="contained"
                        onPress={() => handleApproveRequest(request.id, true)}
                        style={[styles.actionButton, styles.approveButton]}
                        icon="check"
                      >
                        Approve
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => handleApproveRequest(request.id, false)}
                        style={[styles.actionButton, styles.rejectButton]}
                        icon="close"
                        textColor="#f44336"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {request.status === 'approved' && (
                    <Button
                      mode="contained"
                      onPress={() => openAssignModal(request)}
                      style={[styles.actionButton, styles.assignButton]}
                      icon="account-wrench"
                    >
                      Assign Work Order
                    </Button>
                  )}
                  
                  {request.status === 'completed' && (
                    <Button
                      mode="outlined"
                      onPress={() => navigateToDetails(request)}
                      style={styles.actionButton}
                      icon="eye"
                    >
                      View Details
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {filteredRequests.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="wrench" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Maintenance Requests</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No requests match your current filters.' 
                : 'You don\'t have any maintenance requests yet.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      {/* Assign Work Order Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Assign Work Order</Title>
            
            {selectedRequest && (
              <View style={styles.selectedRequestInfo}>
                <Text style={styles.selectedRequestTitle}>{selectedRequest.title}</Text>
                <Text style={styles.selectedRequestDescription}>{selectedRequest.description}</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Select Workman</Text>
            {availableWorkmen.map((workman) => (
              <List.Item
                key={workman.id}
                title={`${workman.first_name} ${workman.last_name}`}
                description={`${workman.email} • ${workman.phone}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={workOrderData.workman_id === workman.id.toString() ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  />
                )}
                onPress={() => setWorkOrderData(prev => ({ ...prev, workman_id: workman.id.toString() }))}
                style={styles.workmanItem}
              />
            ))}

            <TextInput
              label="Work Description *"
              value={workOrderData.work_description}
              onChangeText={(text) => setWorkOrderData(prev => ({ ...prev, work_description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <TextInput
              label="Estimated Hours *"
              value={workOrderData.estimated_hours}
              onChangeText={(text) => setWorkOrderData(prev => ({ ...prev, estimated_hours: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="2.5"
            />

            <TextInput
              label="Materials Required"
              value={workOrderData.materials_required}
              onChangeText={(text) => setWorkOrderData(prev => ({ ...prev, materials_required: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., faucet cartridge, plumber's tape"
            />

            <TextInput
              label="Special Instructions"
              value={workOrderData.special_instructions}
              onChangeText={(text) => setWorkOrderData(prev => ({ ...prev, special_instructions: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
              placeholder="Any special requirements or notes..."
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
                onPress={handleAssignWorkOrder}
                style={styles.modalButton}
                loading={isLoading}
                disabled={isLoading || !workOrderData.workman_id || !workOrderData.work_description}
              >
                Assign Work Order
              </Button>
            </View>
          </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  statusSummary: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statusName: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 8,
  },
  requestTouchable: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  requestCard: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 4,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  requestInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
  timeline: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  timelineLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  costInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  costLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workOrderInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  workOrderLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workmanInfo: {
    fontSize: 12,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  approveButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    borderColor: '#f44336',
  },
  assignButton: {
    backgroundColor: '#2196f3',
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
  selectedRequestInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  selectedRequestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedRequestDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  workmanItem: {
    paddingVertical: 8,
  },
  input: {
    marginBottom: 16,
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

export default LandlordMaintenanceScreen; 