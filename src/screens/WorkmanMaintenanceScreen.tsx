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
  materials_required: string[];
  special_instructions?: string;
  title: string;
  description: string;
  request_type: 'routine' | 'urgent' | 'emergency' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  premises_name: string;
  unit_number: string;
  tenant_first_name: string;
  tenant_last_name: string;
  tenant_phone: string;
  estimated_cost: string;
  landlord_first_name?: string;
  landlord_last_name?: string;
  landlord_phone?: string;
}

const WorkmanMaintenanceScreen: React.FC = () => {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [statusUpdateModalVisible, setStatusUpdateModalVisible] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: 'assigned' as WorkOrder['status'],
    notes: '',
    actual_hours: '',
  });



  useEffect(() => {
    loadWorkOrders();
  }, [filterStatus]);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.get(getApiUrl('/workman/work-orders'), {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filterStatus === 'all' ? undefined : filterStatus }
      });

      if (response.data.status === 200) {
        setWorkOrders(response.data.work_orders);
      } else {
        Alert.alert('Error', 'Failed to load work orders');
      }
    } catch (error) {
      console.error('Error loading work orders:', error);
      Alert.alert('Error', 'Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkOrders();
    setRefreshing(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedWorkOrder) return;

    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.put(
        getApiUrl(`/work-orders/${selectedWorkOrder.id}/status`),
        statusUpdateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 200) {
        // Refresh work orders to get updated data
        await loadWorkOrders();
        
        setStatusUpdateModalVisible(false);
        setSelectedWorkOrder(null);
        setStatusUpdateData({
          status: 'assigned',
          notes: '',
          actual_hours: '',
        });
        
        Alert.alert('Success', 'Work order status updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update work order status');
      }
    } catch (error) {
      console.error('Error updating work order status:', error);
      Alert.alert('Error', 'Failed to update work order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#9C27B0';
      case 'in_progress': return '#FF9800';
      case 'on_hold': return '#F44336';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#757575';
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
      default: return 'build';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return 'assignment';
      case 'in_progress': return 'engineering';
      case 'on_hold': return 'pause';
      case 'completed': return 'check-circle';
      case 'cancelled': return 'cancel';
      default: return 'assignment';
    }
  };

  const filteredWorkOrders = workOrders.filter(workOrder => {
    if (filterStatus !== 'all' && workOrder.status !== filterStatus) return false;
    return true;
  });

  const assignedWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'assigned');
  const inProgressWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'in_progress');
  const completedWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'completed');

  const totalHours = workOrders.reduce((sum, wo) => sum + (wo.actual_hours || 0), 0);
  const estimatedHours = workOrders.reduce((sum, wo) => sum + wo.estimated_hours, 0);
  const efficiency = estimatedHours > 0 ? ((estimatedHours - totalHours) / estimatedHours) * 100 : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading work orders...</Text>
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
        {/* Performance Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Performance Summary</Title>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{workOrders.length}</Text>
                <Text style={styles.summaryLabel}>Total Orders</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{totalHours.toFixed(1)}h</Text>
                <Text style={styles.summaryLabel}>Hours Worked</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{efficiency.toFixed(1)}%</Text>
                <Text style={styles.summaryLabel}>Efficiency</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Time vs. Estimate</Text>
              <ProgressBar 
                progress={Math.min(totalHours / estimatedHours, 1)} 
                color={totalHours <= estimatedHours ? '#4CAF50' : '#F44336'}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {totalHours.toFixed(1)}h / {estimatedHours.toFixed(1)}h estimated
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Filters */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Filter by Status</Title>
            <SegmentedButtons
              value={filterStatus}
              onValueChange={setFilterStatus}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Assigned Work Orders */}
        {assignedWorkOrders.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Assigned Work Orders ({assignedWorkOrders.length})
            </Title>
            {assignedWorkOrders.map((workOrder) => (
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
                        {workOrder.title}
                      </Title>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: getPriorityColor(workOrder.priority) }}
                        style={{ borderColor: getPriorityColor(workOrder.priority) }}
                      >
                        {workOrder.priority}
                      </Chip>
                    </View>
                  </View>
                  
                  <View style={styles.workOrderInfo}>
                    <Text style={styles.workOrderNumber}>
                      Work Order: {workOrder.work_order_number}
                    </Text>
                    <Paragraph style={styles.workOrderDescription}>
                      {workOrder.description}
                    </Paragraph>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="location-on" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.premises_name} - Unit {workOrder.unit_number}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="person" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.tenant_first_name} {workOrder.tenant_last_name}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="phone" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.tenant_phone}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="schedule" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          Est. {workOrder.estimated_hours}h • Assigned {new Date(workOrder.assigned_date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    {workOrder.materials_required && workOrder.materials_required.length > 0 && (
                      <View style={styles.materialsContainer}>
                        <Text style={styles.materialsLabel}>Materials Required:</Text>
                        <View style={styles.materialsList}>
                          {workOrder.materials_required.map((material, index) => (
                            <Chip key={index} mode="outlined" style={styles.materialChip}>
                              {material}
                            </Chip>
                          ))}
                        </View>
                      </View>
                    )}

                    {workOrder.special_instructions && (
                      <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsLabel}>Special Instructions:</Text>
                        <Text style={styles.instructionsText}>{workOrder.special_instructions}</Text>
                      </View>
                    )}
                  </View>

                  <Button
                    mode="contained"
                    onPress={() => {
                      setSelectedWorkOrder(workOrder);
                      setStatusUpdateData(prev => ({ ...prev, status: 'in_progress' }));
                      setStatusUpdateModalVisible(true);
                    }}
                    style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                    icon="play"
                  >
                    Start Work
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* In Progress Work Orders */}
        {inProgressWorkOrders.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              In Progress ({inProgressWorkOrders.length})
            </Title>
            {inProgressWorkOrders.map((workOrder) => (
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
                        {workOrder.title}
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
                  
                  <View style={styles.workOrderInfo}>
                    <Text style={styles.workOrderNumber}>
                      Work Order: {workOrder.work_order_number}
                    </Text>
                    <Paragraph style={styles.workOrderDescription}>
                      {workOrder.description}
                    </Paragraph>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="location-on" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.premises_name} - Unit {workOrder.unit_number}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="schedule" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          Started {workOrder.started_date ? new Date(workOrder.started_date).toLocaleDateString() : 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {workOrder.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Current Notes:</Text>
                        <Text style={styles.notesText}>{workOrder.notes}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setSelectedWorkOrder(workOrder);
                        setStatusUpdateData(prev => ({ ...prev, status: 'on_hold' }));
                        setStatusUpdateModalVisible(true);
                      }}
                      style={styles.actionButton}
                      icon="pause"
                    >
                      Put On Hold
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setSelectedWorkOrder(workOrder);
                        setStatusUpdateData(prev => ({ ...prev, status: 'completed' }));
                        setStatusUpdateModalVisible(true);
                      }}
                      style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                      icon="check"
                    >
                      Complete
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Completed Work Orders */}
        {completedWorkOrders.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Completed ({completedWorkOrders.length})
            </Title>
            {completedWorkOrders.map((workOrder) => (
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
                        {workOrder.title}
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
                  
                  <View style={styles.workOrderInfo}>
                    <Text style={styles.workOrderNumber}>
                      Work Order: {workOrder.work_order_number}
                    </Text>
                    <Paragraph style={styles.workOrderDescription}>
                      {workOrder.description}
                    </Paragraph>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="location-on" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.premises_name} - Unit {workOrder.unit_number}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="schedule" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          Completed {workOrder.completed_date ? new Date(workOrder.completed_date).toLocaleDateString() : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons name="timer" size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {workOrder.actual_hours}h actual vs {workOrder.estimated_hours}h estimated
                        </Text>
                      </View>
                    </View>

                    {workOrder.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Completion Notes:</Text>
                        <Text style={styles.notesText}>{workOrder.notes}</Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {filteredWorkOrders.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="assignment" size={64} color="#ccc" />
              <Title style={styles.emptyTitle}>No Work Orders</Title>
              <Text style={styles.emptyText}>
                {filterStatus === 'all' 
                  ? 'You don\'t have any assigned work orders yet.'
                  : `No work orders with status "${filterStatus}".`}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Status Update Modal */}
      <Portal>
        <Modal
          visible={statusUpdateModalVisible}
          onDismiss={() => setStatusUpdateModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>
            Update Work Order Status
          </Title>
          
          {selectedWorkOrder && (
            <View style={styles.selectedWorkOrderInfo}>
              <Text style={styles.selectedWorkOrderTitle}>
                {selectedWorkOrder.title}
              </Text>
              <Text style={styles.selectedWorkOrderNumber}>
                {selectedWorkOrder.work_order_number}
              </Text>
            </View>
          )}

          <TextInput
            label="Status"
            value={statusUpdateData.status}
            onChangeText={(text) => setStatusUpdateData(prev => ({ ...prev, status: text as WorkOrder['status'] }))}
            mode="outlined"
            style={styles.modalInput}
            disabled
          />

          <TextInput
            label="Notes"
            value={statusUpdateData.notes}
            onChangeText={(text) => setStatusUpdateData(prev => ({ ...prev, notes: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Add notes about the current status..."
          />

          {(statusUpdateData.status === 'completed' || statusUpdateData.status === 'in_progress') && (
            <TextInput
              label="Actual Hours"
              value={statusUpdateData.actual_hours}
              onChangeText={(text) => setStatusUpdateData(prev => ({ ...prev, actual_hours: text }))}
              mode="outlined"
              keyboardType="numeric"
              style={styles.modalInput}
              placeholder="2.5"
            />
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setStatusUpdateModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleStatusUpdate}
              style={styles.modalButton}
            >
              Update Status
            </Button>
          </View>
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
  summaryCard: {
    margin: 16,
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  workOrderCard: {
    marginBottom: 12,
    elevation: 2,
  },
  workOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workOrderTitleContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workOrderTitle: {
    fontSize: 16,
    flex: 1,
  },
  workOrderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  workOrderDescription: {
    marginBottom: 12,
    color: '#666',
  },
  workOrderInfo: {
    marginBottom: 16,
  },
  detailsGrid: {
    marginBottom: 12,
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
  materialsContainer: {
    marginBottom: 12,
  },
  materialsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialChip: {
    marginBottom: 4,
  },
  instructionsContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#e65100',
  },
  instructionsText: {
    fontSize: 14,
    color: '#e65100',
  },
  notesContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#7b1fa2',
  },
  notesText: {
    fontSize: 14,
    color: '#7b1fa2',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  segmentedButtons: {
    marginBottom: 8,
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
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedWorkOrderInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedWorkOrderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  selectedWorkOrderNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalInput: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default WorkmanMaintenanceScreen; 