import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  FAB,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
  List,
  Divider,
  Badge,
  ProgressBar,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { getApiUrl } from '../config/app';
import * as SecureStore from 'expo-secure-store';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  request_type: 'routine' | 'urgent' | 'emergency' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in_progress' | 'completed';
  premises_name: string;
  unit_number: string;
  tenant_first_name?: string;
  tenant_last_name?: string;
  estimated_cost: string;
  requested_date: string;
  approved_date?: string;
  assigned_date?: string;
  started_date?: string;
  completed_date?: string;
  tenant_rating?: number;
  tenant_feedback?: string;
  work_order_number?: string;
  work_order_status?: string;
  workman_first_name?: string;
  workman_last_name?: string;
}

interface WorkOrder {
  id: number;
  work_order_number: string;
  work_description: string;
  estimated_hours: number;
  actual_hours?: number;
  status: 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  assigned_date: string;
  started_date?: string;
  completed_date?: string;
  notes?: string;
  workman_first_name: string;
  workman_last_name: string;
}

const MaintenanceDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    loadMaintenanceData();
  }, [filterStatus, filterType]);

  const loadMaintenanceData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Load data based on user type
      if (user?.user_type === 'landlord') {
        await loadLandlordData(token);
      } else if (user?.user_type === 'workman') {
        await loadWorkmanData(token);
      } else {
        await loadTenantData(token);
      }
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      Alert.alert('Error', 'Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const loadLandlordData = async (token: string) => {
    try {
      // Load maintenance requests for landlord's organization
      const requestsResponse = await axios.get(getApiUrl('/maintenance-requests'), {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          status: filterStatus === 'all' ? undefined : filterStatus,
          type: filterType === 'all' ? undefined : filterType
        }
      });

      if (requestsResponse.data.status === 200) {
        setMaintenanceRequests(requestsResponse.data.maintenance_requests || []);
      }

      // Load work orders for landlord's organization
      const workOrdersResponse = await axios.get(getApiUrl('/work-orders'), {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          status: filterStatus === 'all' ? undefined : filterStatus
        }
      });

      if (workOrdersResponse.data.status === 200) {
        setWorkOrders(workOrdersResponse.data.work_orders || []);
      }
    } catch (error) {
      console.error('Error loading landlord data:', error);
    }
  };

  const loadWorkmanData = async (token: string) => {
    try {
      // Load work orders assigned to the workman
      const response = await axios.get(getApiUrl('/workman/work-orders'), {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          status: filterStatus === 'all' ? undefined : filterStatus
        }
      });

      if (response.data.status === 200) {
        setWorkOrders(response.data.work_orders || []);
      }
    } catch (error) {
      console.error('Error loading workman data:', error);
    }
  };

  const loadTenantData = async (token: string) => {
    try {
      // Load maintenance requests for the tenant
      const response = await axios.get(getApiUrl('/maintenance-requests'), {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          status: filterStatus === 'all' ? undefined : filterStatus,
          type: filterType === 'all' ? undefined : filterType
        }
      });

      if (response.data.status === 200) {
        setMaintenanceRequests(response.data.maintenance_requests || []);
      }
    } catch (error) {
      console.error('Error loading tenant data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaintenanceData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#2196F3';
      case 'rejected': return '#F44336';
      case 'assigned': return '#9C27B0';
      case 'in_progress': return '#FF9800';
      case 'completed': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'critical': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'routine': return 'build';
      case 'urgent': return 'warning';
      case 'emergency': return 'emergency';
      case 'preventive': return 'shield-check';
      default: return 'build';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'clock-outline';
      case 'approved': return 'check-circle';
      case 'rejected': return 'close-circle';
      case 'assigned': return 'account-check';
      case 'in_progress': return 'progress-clock';
      case 'completed': return 'check-circle';
      default: return 'help-circle';
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (filterType !== 'all' && request.request_type !== filterType) return false;
    return true;
  });

  const filteredWorkOrders = workOrders.filter(workOrder => {
    if (filterStatus !== 'all' && workOrder.status !== filterStatus) return false;
    return true;
  });

  // Calculate statistics
  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(r => r.status === 'pending').length;
  const inProgressRequests = maintenanceRequests.filter(r => r.status === 'in_progress').length;
  const completedRequests = maintenanceRequests.filter(r => r.status === 'completed').length;

  const totalWorkOrders = workOrders.length;
  const assignedWorkOrders = workOrders.filter(w => w.status === 'assigned').length;
  const inProgressWorkOrders = workOrders.filter(w => w.status === 'in_progress').length;
  const completedWorkOrders = workOrders.filter(w => w.status === 'completed').length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading maintenance data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>
              {user?.user_type === 'landlord' ? 'Maintenance Management' :
               user?.user_type === 'workman' ? 'Work Orders Dashboard' :
               'My Maintenance Requests'}
            </Title>
            <Paragraph style={styles.headerSubtitle}>
              {user?.user_type === 'landlord' ? 'Manage all maintenance requests and work orders for your organization' :
               user?.user_type === 'workman' ? 'Track your assigned work orders and performance' :
               'Monitor your maintenance requests and their progress'}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Statistics Summary */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Overview</Title>
            <View style={styles.statsGrid}>
              {user?.user_type !== 'workman' && (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalRequests}</Text>
                    <Text style={styles.statLabel}>Total Requests</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{pendingRequests}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{inProgressRequests}</Text>
                    <Text style={styles.statLabel}>In Progress</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{completedRequests}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                </>
              )}
              
              {user?.user_type === 'workman' && (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalWorkOrders}</Text>
                    <Text style={styles.statLabel}>Total Orders</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{assignedWorkOrders}</Text>
                    <Text style={styles.statLabel}>Assigned</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{inProgressWorkOrders}</Text>
                    <Text style={styles.statLabel}>In Progress</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{completedWorkOrders}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                </>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Filters */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Filters</Title>
            <SegmentedButtons
              value={filterStatus}
              onValueChange={setFilterStatus}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              style={styles.segmentedButtons}
            />
            
            {user?.user_type !== 'workman' && (
              <SegmentedButtons
                value={filterType}
                onValueChange={setFilterType}
                buttons={[
                  { value: 'all', label: 'All Types' },
                  { value: 'routine', label: 'Routine' },
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'emergency', label: 'Emergency' },
                ]}
                style={[styles.segmentedButtons, { marginTop: 8 }]}
              />
            )}
          </Card.Content>
        </Card>

        {/* Maintenance Requests (for landlords and tenants) */}
        {user?.user_type !== 'workman' && filteredRequests.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Maintenance Requests ({filteredRequests.length})
            </Title>
            {filteredRequests.map((request) => (
              <Card key={request.id} style={styles.requestCard}>
                <Card.Content>
                  <View style={styles.requestHeader}>
                    <MaterialIcons 
                      name={getRequestTypeIcon(request.request_type)} 
                      size={24} 
                      color={getPriorityColor(request.priority)} 
                    />
                    <View style={styles.requestTitleContainer}>
                      <Title style={styles.requestTitle}>
                        {request.title}
                      </Title>
                      <View style={styles.requestChips}>
                        <Chip 
                          mode="outlined" 
                          textStyle={{ color: getPriorityColor(request.priority) }}
                          style={{ borderColor: getPriorityColor(request.priority), marginRight: 8 }}
                        >
                          {request.priority}
                        </Chip>
                        <Chip 
                          mode="outlined" 
                          textStyle={{ color: getStatusColor(request.status) }}
                          style={{ borderColor: getStatusColor(request.status) }}
                        >
                          {request.status}
                        </Chip>
                      </View>
                    </View>
                  </View>
                  
                  <Paragraph style={styles.requestDescription}>
                    {request.description}
                  </Paragraph>
                  
                  <View style={styles.requestDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="location-on" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {request.premises_name} - Unit {request.unit_number}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="schedule" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Requested {new Date(request.requested_date).toLocaleDateString()}
                      </Text>
                    </View>
                    {request.estimated_cost && (
                      <View style={styles.detailItem}>
                        <MaterialIcons name="attach-money" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          Est. Cost: ${request.estimated_cost}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Button
                    mode="outlined"
                    onPress={() => {
                      setSelectedRequest(request);
                      setDetailsModalVisible(true);
                    }}
                    style={styles.detailsButton}
                  >
                    View Details
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Work Orders (for landlords and workmen) */}
        {(user?.user_type === 'landlord' || user?.user_type === 'workman') && filteredWorkOrders.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Work Orders ({filteredWorkOrders.length})
            </Title>
            {filteredWorkOrders.map((workOrder) => (
              <Card key={workOrder.id} style={styles.workOrderCard}>
                <Card.Content>
                  <View style={styles.workOrderHeader}>
                    <MaterialIcons 
                      name={getStatusIcon(workOrder.status)} 
                      size={24} 
                      color={getStatusColor(workOrder.status)} 
                    />
                    <View style={styles.workOrderTitleContainer}>
                      <Title style={styles.workOrderTitle}>
                        {workOrder.work_order_number}
                      </Title>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: getStatusColor(workOrder.status) }}
                        style={{ borderColor: getStatusColor(workOrder.status) }}
                      >
                        {workOrder.status}
                      </Chip>
                    </View>
                  </View>
                  
                  <Paragraph style={styles.workOrderDescription}>
                    {workOrder.work_description}
                  </Paragraph>
                  
                  <View style={styles.workOrderDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="schedule" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Assigned {new Date(workOrder.assigned_date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="timer" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Est. {workOrder.estimated_hours}h
                        {workOrder.actual_hours && ` • Actual: ${workOrder.actual_hours}h`}
                      </Text>
                    </View>
                    {workOrder.workman_first_name && (
                      <View style={styles.detailItem}>
                        <MaterialIcons name="person" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.workman_first_name} {workOrder.workman_last_name}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Button
                    mode="outlined"
                    onPress={() => {
                      // Navigate to work order details
                      Alert.alert('Work Order Details', 'Navigate to detailed view');
                    }}
                    style={styles.detailsButton}
                  >
                    View Details
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredRequests.length === 0 && filteredWorkOrders.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="assignment" size={64} color="#ccc" />
              <Title style={styles.emptyTitle}>No Items Found</Title>
              <Text style={styles.emptyText}>
                {filterStatus === 'all' 
                  ? 'No maintenance items found for the current filters.'
                  : `No items with status "${filterStatus}" found.`}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={detailsModalVisible}
          onDismiss={() => setDetailsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedRequest && (
            <>
              <Title style={styles.modalTitle}>
                {selectedRequest.title}
              </Title>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  {selectedRequest.description}
                </Text>
                
                <View style={styles.modalDetails}>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Status: </Text>
                    {selectedRequest.status}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Priority: </Text>
                    {selectedRequest.priority}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Type: </Text>
                    {selectedRequest.request_type}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Location: </Text>
                    {selectedRequest.premises_name} - Unit {selectedRequest.unit_number}
                  </Text>
                  <Text style={styles.modalDetail}>
                    <Text style={styles.modalLabel}>Requested: </Text>
                    {new Date(selectedRequest.requested_date).toLocaleDateString()}
                  </Text>
                  {selectedRequest.estimated_cost && (
                    <Text style={styles.modalDetail}>
                      <Text style={styles.modalLabel}>Estimated Cost: </Text>
                      ${selectedRequest.estimated_cost}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setDetailsModalVisible(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                {user?.user_type === 'landlord' && (
                  <Button
                    mode="contained"
                    onPress={() => {
                      setDetailsModalVisible(false);
                      // Navigate to edit/approval screen
                      Alert.alert('Action', 'Navigate to edit/approval screen');
                    }}
                    style={styles.modalButton}
                  >
                    Manage Request
                  </Button>
                )}
              </View>
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  filterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  requestCard: {
    marginBottom: 12,
    elevation: 2,
  },
  workOrderCard: {
    marginBottom: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  workOrderTitleContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  workOrderTitle: {
    fontSize: 16,
  },
  requestChips: {
    flexDirection: 'row',
  },
  requestDescription: {
    marginBottom: 12,
    color: '#666',
  },
  workOrderDescription: {
    marginBottom: 12,
    color: '#666',
  },
  requestDetails: {
    marginBottom: 16,
  },
  workOrderDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  detailsButton: {
    alignSelf: 'flex-start',
  },
  emptyCard: {
    margin: 16,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  modalDetails: {
    marginBottom: 16,
  },
  modalDetail: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default MaintenanceDashboardScreen;
