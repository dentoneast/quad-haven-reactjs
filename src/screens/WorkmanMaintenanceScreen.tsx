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
  Portal,
  Modal,
  TextInput,
  Button,
  List,
  Searchbar,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface WorkOrder {
  id: number;
  work_order_number: string;
  work_description: string;
  estimated_hours: number;
  actual_hours?: number;
  materials_required: string[];
  special_instructions?: string;
  status: string;
  assigned_date: string;
  started_date?: string;
  completed_date?: string;
  notes?: string;
  maintenance_request: {
    id: number;
    title: string;
    description: string;
    request_type: string;
    priority: string;
    premises_name: string;
    premises_address: string;
    unit_number?: string;
    tenant_first_name: string;
    tenant_last_name: string;
    tenant_phone: string;
    estimated_cost?: number;
  };
}

const WorkmanMaintenanceScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: '',
    actual_hours: '',
  });

  const [photoData, setPhotoData] = useState({
    photo_type: 'during',
    caption: '',
  });

  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    loadWorkOrders();
  }, []);

  useEffect(() => {
    filterWorkOrders();
  }, [searchQuery, statusFilter, workOrders]);

  const loadWorkOrders = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/maintenance-requests?workman_id=' + user?.id);
      // setWorkOrders(response.data.work_orders);
      
      // Mock data for now
      setWorkOrders([
        {
          id: 1,
          work_order_number: 'WO-2024-001',
          work_description: 'Replace kitchen faucet cartridge and fix water leak under sink',
          estimated_hours: 2,
          actual_hours: 2.5,
          materials_required: ['faucet cartridge', 'plumber\'s tape', 'silicone sealant'],
          special_instructions: 'Ensure water is completely turned off before starting work',
          status: 'completed',
          assigned_date: '2024-01-17T08:00:00Z',
          started_date: '2024-01-18T09:00:00Z',
          completed_date: '2024-01-18T14:00:00Z',
          notes: 'Replaced cartridge and sealed all connections. No more leaks.',
          maintenance_request: {
            id: 1,
            title: 'Leaky Kitchen Faucet',
            description: 'The kitchen faucet is dripping constantly and needs repair. Water is accumulating under the sink.',
            request_type: 'routine',
            priority: 'medium',
            premises_name: 'Sunset Gardens Apartments',
            premises_address: '123 Sunset Blvd, Los Angeles, CA 90210',
            unit_number: '101',
            tenant_first_name: 'John',
            tenant_last_name: 'Doe',
            tenant_phone: '+1-555-0101',
            estimated_cost: 150.00,
          },
        },
        {
          id: 2,
          work_order_number: 'WO-2024-002',
          work_description: 'Replace broken window lock mechanism',
          estimated_hours: 1,
          materials_required: ['new window lock', 'screws', 'screwdriver'],
          special_instructions: 'Test lock functionality after installation',
          status: 'in_progress',
          assigned_date: '2024-01-21T09:00:00Z',
          started_date: '2024-01-21T10:00:00Z',
          notes: 'Started work on window lock replacement. Need to test security.',
          maintenance_request: {
            id: 2,
            title: 'Broken Window Lock',
            description: 'The lock on the bedroom window is broken and won\'t secure properly. This is a security concern.',
            request_type: 'urgent',
            priority: 'high',
            premises_name: 'Sunset Gardens Apartments',
            premises_address: '123 Sunset Blvd, Los Angeles, CA 90210',
            unit_number: '202',
            tenant_first_name: 'Mike',
            tenant_last_name: 'Johnson',
            tenant_phone: '+1-555-0103',
            estimated_cost: 75.00,
          },
        },
        {
          id: 3,
          work_order_number: 'WO-2024-003',
          work_description: 'Inspect and repair garbage disposal unit',
          estimated_hours: 1.5,
          materials_required: ['garbage disposal wrench', 'replacement parts if needed'],
          special_instructions: 'Check for foreign objects that may be causing the jam',
          status: 'assigned',
          assigned_date: '2024-01-21T13:00:00Z',
          maintenance_request: {
            id: 4,
            title: 'Garbage Disposal Jammed',
            description: 'The garbage disposal is stuck and won\'t turn on. There might be something lodged inside.',
            request_type: 'routine',
            priority: 'medium',
            premises_name: 'Riverside Townhomes',
            premises_address: '789 River Road, Houston, TX 77001',
            unit_number: '1',
            tenant_first_name: 'Alex',
            tenant_last_name: 'Garcia',
            tenant_phone: '+1-555-0107',
            estimated_cost: 120.00,
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to load work orders:', error);
      Alert.alert('Error', 'Failed to load work orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterWorkOrders = () => {
    let filtered = workOrders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(workOrder => workOrder.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(workOrder =>
        workOrder.work_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.work_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.maintenance_request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workOrder.maintenance_request.premises_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWorkOrders(filtered);
  };

  const handleUpdateStatus = async () => {
    if (!selectedWorkOrder || !updateData.status) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put(`/work-orders/${selectedWorkOrder.id}/status`, updateData);
      
      // Mock success
      setUpdateModalVisible(false);
      setUpdateData({ status: '', notes: '', actual_hours: '' });
      await loadWorkOrders();
      Alert.alert('Success', 'Work order status updated successfully');
    } catch (error) {
      console.error('Failed to update work order status:', error);
      Alert.alert('Error', 'Failed to update work order status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedWorkOrder || !photoData.photo_type) {
      Alert.alert('Error', 'Please select a photo type');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call for photo upload
      // await api.post(`/maintenance-requests/${selectedWorkOrder.maintenance_request.id}/photos`, photoData);
      
      // Mock success
      setPhotoModalVisible(false);
      setPhotoData({ photo_type: 'during', caption: '' });
      Alert.alert('Success', 'Photo added successfully');
    } catch (error) {
      console.error('Failed to add photo:', error);
      Alert.alert('Error', 'Failed to add photo');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#9c27b0';
      case 'in_progress': return '#ff5722';
      case 'on_hold': return '#ff9800';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkOrders();
    setRefreshing(false);
  };

  const openUpdateModal = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setUpdateData({
      status: workOrder.status,
      notes: workOrder.notes || '',
      actual_hours: workOrder.actual_hours?.toString() || '',
    });
    setUpdateModalVisible(true);
  };

  const openPhotoModal = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setPhotoModalVisible(true);
  };

  const navigateToDetails = (workOrder: WorkOrder) => {
    navigation.navigate('MaintenanceRequestDetails' as never, { requestId: workOrder.maintenance_request.id } as never);
  };

  const getWorkOrderCountByStatus = () => {
    const counts: { [key: string]: number } = {};
    statuses.forEach(status => {
      if (status.value !== 'all') {
        counts[status.value] = workOrders.filter(wo => wo.status === status.value).length;
      }
    });
    return counts;
  };

  const getTotalHours = () => {
    return workOrders
      .filter(wo => wo.actual_hours)
      .reduce((sum, wo) => sum + (wo.actual_hours || 0), 0);
  };

  const getCompletedCount = () => {
    return workOrders.filter(wo => wo.status === 'completed').length;
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
          <Title style={styles.title}>My Work Orders</Title>
          <Text style={styles.subtitle}>
            Manage your assigned maintenance work orders
          </Text>
        </Surface>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{workOrders.length}</Title>
              <Text style={styles.statLabel}>Total Orders</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{getCompletedCount()}</Title>
              <Text style={styles.statLabel}>Completed</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{getTotalHours()}</Title>
              <Text style={styles.statLabel}>Total Hours</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Status Summary */}
        <Surface style={styles.statusSummary}>
          <Title style={styles.sectionTitle}>Work Order Status Summary</Title>
          <View style={styles.statusGrid}>
            {statuses.filter(s => s.value !== 'all').map(status => (
              <View key={status.value} style={styles.statusItem}>
                <Text style={styles.statusCount}>{getWorkOrderCountByStatus()[status.value] || 0}</Text>
                <Text style={styles.statusName}>{status.label}</Text>
              </View>
            ))}
          </View>
        </Surface>

        <Searchbar
          placeholder="Search work orders, properties, or descriptions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={statuses.map(status => ({ value: status.value, label: status.label }))}
          style={styles.statusFilter}
        />

        {filteredWorkOrders.map((workOrder) => (
          <TouchableOpacity
            key={workOrder.id}
            onPress={() => navigateToDetails(workOrder)}
            style={styles.workOrderTouchable}
          >
            <Card style={styles.workOrderCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.workOrderTitle}>{workOrder.work_order_number}</Title>
                  <View style={styles.statusContainer}>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(workOrder.status) }}
                      style={styles.statusChip}
                    >
                      {workOrder.status.replace('_', ' ').toUpperCase()}
                    </Chip>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getPriorityColor(workOrder.maintenance_request.priority) }}
                      style={styles.priorityChip}
                    >
                      {workOrder.maintenance_request.priority.toUpperCase()}
                    </Chip>
                  </View>
                </View>

                <Text style={styles.maintenanceTitle}>{workOrder.maintenance_request.title}</Text>
                <Text style={styles.description}>{workOrder.work_description}</Text>

                <View style={styles.requestInfo}>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="office-building" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {workOrder.maintenance_request.premises_name} {workOrder.maintenance_request.unit_number && `- Unit ${workOrder.maintenance_request.unit_number}`}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                    <Text style={styles.infoText}>{workOrder.maintenance_request.premises_address}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {workOrder.maintenance_request.tenant_first_name} {workOrder.maintenance_request.tenant_last_name}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone" size={16} color="#666" />
                    <Text style={styles.infoText}>{workOrder.maintenance_request.tenant_phone}</Text>
                  </View>
                </View>

                <View style={styles.workDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Estimated Hours:</Text>
                    <Text style={styles.detailValue}>{workOrder.estimated_hours}h</Text>
                  </View>
                  
                  {workOrder.actual_hours && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Actual Hours:</Text>
                      <Text style={styles.detailValue}>{workOrder.actual_hours}h</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Assigned:</Text>
                    <Text style={styles.detailValue}>{formatDate(workOrder.assigned_date)}</Text>
                  </View>
                  
                  {workOrder.started_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Started:</Text>
                      <Text style={styles.detailValue}>{formatDate(workOrder.started_date)} at {formatTime(workOrder.started_date)}</Text>
                    </View>
                  )}
                  
                  {workOrder.completed_date && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Completed:</Text>
                      <Text style={styles.detailValue}>{formatDate(workOrder.completed_date)} at {formatTime(workOrder.completed_date)}</Text>
                    </View>
                  )}
                </View>

                {workOrder.materials_required.length > 0 && (
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

                {workOrder.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Your Notes:</Text>
                    <Text style={styles.notesText}>{workOrder.notes}</Text>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  {workOrder.status === 'assigned' && (
                    <Button
                      mode="contained"
                      onPress={() => openUpdateModal(workOrder)}
                      style={[styles.actionButton, styles.startButton]}
                      icon="play"
                    >
                      Start Work
                    </Button>
                  )}
                  
                  {workOrder.status === 'in_progress' && (
                    <>
                      <Button
                        mode="contained"
                        onPress={() => openUpdateModal(workOrder)}
                        style={[styles.actionButton, styles.completeButton]}
                        icon="check"
                      >
                        Complete Work
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => openUpdateModal(workOrder)}
                        style={styles.actionButton}
                        icon="pause"
                      >
                        Put On Hold
                      </Button>
                    </>
                  )}
                  
                  {workOrder.status === 'on_hold' && (
                    <Button
                      mode="contained"
                      onPress={() => openUpdateModal(workOrder)}
                      style={[styles.actionButton, styles.resumeButton]}
                      icon="play"
                    >
                      Resume Work
                    </Button>
                  )}
                  
                  <Button
                    mode="outlined"
                    onPress={() => openPhotoModal(workOrder)}
                    style={styles.actionButton}
                    icon="camera"
                  >
                    Add Photo
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {filteredWorkOrders.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="wrench" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Work Orders</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all'
                ? 'No work orders match your current filters.' 
                : 'You don\'t have any assigned work orders yet.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      {/* Update Status Modal */}
      <Portal>
        <Modal
          visible={updateModalVisible}
          onDismiss={() => setUpdateModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Update Work Order Status</Title>
          
          {selectedWorkOrder && (
            <View style={styles.selectedWorkOrderInfo}>
              <Text style={styles.selectedWorkOrderTitle}>{selectedWorkOrder.work_order_number}</Text>
              <Text style={styles.selectedWorkOrderDescription}>{selectedWorkOrder.maintenance_request.title}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>New Status</Text>
          <SegmentedButtons
            value={updateData.status}
            onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}
            buttons={[
              { value: 'in_progress', label: 'In Progress' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Actual Hours (if completed)"
            value={updateData.actual_hours}
            onChangeText={(text) => setUpdateData(prev => ({ ...prev, actual_hours: text }))}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            placeholder="2.5"
          />

          <TextInput
            label="Notes"
            value={updateData.notes}
            onChangeText={(text) => setUpdateData(prev => ({ ...prev, notes: text }))}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Update on progress, issues encountered, or completion details..."
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setUpdateModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateStatus}
              style={styles.modalButton}
              loading={isLoading}
              disabled={isLoading || !updateData.status}
            >
              Update Status
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Add Photo Modal */}
      <Portal>
        <Modal
          visible={photoModalVisible}
          onDismiss={() => setPhotoModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Add Work Photo</Title>
          
          {selectedWorkOrder && (
            <View style={styles.selectedWorkOrderInfo}>
              <Text style={styles.selectedWorkOrderTitle}>{selectedWorkOrder.work_order_number}</Text>
              <Text style={styles.selectedWorkOrderDescription}>{selectedWorkOrder.maintenance_request.title}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Photo Type</Text>
          <SegmentedButtons
            value={photoData.photo_type}
            onValueChange={(value) => setPhotoData(prev => ({ ...prev, photo_type: value }))}
            buttons={[
              { value: 'before', label: 'Before' },
              { value: 'during', label: 'During' },
              { value: 'after', label: 'After' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Caption (Optional)"
            value={photoData.caption}
            onChangeText={(text) => setPhotoData(prev => ({ ...prev, caption: text }))}
            mode="outlined"
            style={styles.input}
            placeholder="Describe what this photo shows..."
          />

          <View style={styles.photoUploadArea}>
            <MaterialCommunityIcons name="camera" size={48} color="#ccc" />
            <Text style={styles.photoUploadText}>Tap to take photo or select from gallery</Text>
            <Button
              mode="outlined"
              onPress={() => {/* TODO: Implement photo capture/selection */}}
              style={styles.photoButton}
              icon="camera"
            >
              Select Photo
            </Button>
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setPhotoModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddPhoto}
              style={styles.modalButton}
              loading={isLoading}
              disabled={isLoading || !photoData.photo_type}
            >
              Add Photo
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
  statusFilter: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  workOrderTouchable: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  workOrderCard: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workOrderTitle: {
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
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
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
  workDetails: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#6200ee',
  },
  materialsContainer: {
    marginBottom: 16,
  },
  materialsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    opacity: 0.8,
  },
  notesContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
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
  startButton: {
    backgroundColor: '#2196f3',
  },
  completeButton: {
    backgroundColor: '#4caf50',
  },
  resumeButton: {
    backgroundColor: '#ff9800',
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
  selectedWorkOrderInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  selectedWorkOrderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedWorkOrderDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  photoUploadArea: {
    alignItems: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 16,
  },
  photoUploadText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  photoButton: {
    borderColor: '#6200ee',
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

export default WorkmanMaintenanceScreen; 