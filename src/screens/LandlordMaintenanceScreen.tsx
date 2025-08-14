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
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  request_type: 'routine' | 'urgent' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in_progress' | 'completed';
  premises_name: string;
  unit_number: string;
  tenant_first_name: string;
  tenant_last_name: string;
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

const LandlordMaintenanceScreen: React.FC = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'rejected'>('approved');
  const [approvalComments, setApprovalComments] = useState('');
  const [assignmentData, setAssignmentData] = useState({
    workman_id: '',
    work_description: '',
    estimated_hours: '',
    materials_required: '',
    special_instructions: '',
  });

  // Mock data for demonstration
  const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
      id: 1,
      title: 'Leaky Kitchen Faucet',
      description: 'The kitchen faucet is dripping constantly and needs repair.',
      request_type: 'routine',
      priority: 'medium',
      status: 'pending',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '101',
      tenant_first_name: 'John',
      tenant_last_name: 'Doe',
      estimated_cost: '150.00',
      requested_date: '2024-01-15T15:00:00Z',
    },
    {
      id: 2,
      title: 'Broken Window Lock',
      description: 'The lock on the bedroom window is broken and won\'t secure properly.',
      request_type: 'urgent',
      priority: 'high',
      status: 'approved',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '202',
      tenant_first_name: 'Mike',
      tenant_last_name: 'Johnson',
      estimated_cost: '75.00',
      requested_date: '2024-01-20T19:00:00Z',
      approved_date: '2024-01-20T21:00:00Z',
    },
    {
      id: 3,
      title: 'HVAC System Not Working',
      description: 'The air conditioning unit is not cooling properly.',
      request_type: 'emergency',
      priority: 'critical',
      status: 'assigned',
      premises_name: 'Mountain View Estates',
      unit_number: '1',
      tenant_first_name: 'David',
      tenant_last_name: 'Brown',
      estimated_cost: '300.00',
      requested_date: '2024-01-18T10:00:00Z',
      approved_date: '2024-01-18T14:00:00Z',
      assigned_date: '2024-01-19T09:00:00Z',
      work_order_number: 'WO-2024-004',
      work_order_status: 'assigned',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
    },
  ];

  const mockWorkOrders: WorkOrder[] = [
    {
      id: 1,
      work_order_number: 'WO-2024-001',
      work_description: 'Replace kitchen faucet cartridge and fix water leak under sink',
      estimated_hours: 2,
      actual_hours: 2.5,
      status: 'completed',
      assigned_date: '2024-01-17T08:00:00Z',
      started_date: '2024-01-18T09:00:00Z',
      completed_date: '2024-01-18T14:00:00Z',
      notes: 'Replaced cartridge and sealed all connections. No more leaks.',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
    },
    {
      id: 2,
      work_order_number: 'WO-2024-002',
      work_description: 'Replace broken window lock mechanism',
      estimated_hours: 1,
      actual_hours: 1,
      status: 'in_progress',
      assigned_date: '2024-01-21T09:00:00Z',
      started_date: '2024-01-21T10:00:00Z',
      notes: 'Started work on window lock replacement',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
    },
  ];

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const loadMaintenanceData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/maintenance-requests?landlord_id=' + user?.id);
      // const data = await response.json();
      
      // For now, use mock data
      setMaintenanceRequests(mockMaintenanceRequests);
      setWorkOrders(mockWorkOrders);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      Alert.alert('Error', 'Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaintenanceData();
    setRefreshing(false);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/maintenance-requests/${selectedRequest.id}/approve`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: approvalStatus, comments: approvalComments }),
      // });

      // Update local state
      setMaintenanceRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: approvalStatus, approved_date: new Date().toISOString() }
            : req
        )
      );

      setApprovalModalVisible(false);
      setSelectedRequest(null);
      setApprovalComments('');
      Alert.alert('Success', `Request ${approvalStatus} successfully`);
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  const handleAssignWorkOrder = async () => {
    if (!selectedRequest) return;

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/maintenance-requests/${selectedRequest.id}/assign`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(assignmentData),
      // });

      // Update local state
      setMaintenanceRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'assigned', 
                assigned_date: new Date().toISOString(),
                work_order_number: 'WO-' + Date.now(),
                work_order_status: 'assigned',
                workman_first_name: 'Tom',
                workman_last_name: 'Anderson',
              }
            : req
        )
      );

      setAssignmentModalVisible(false);
      setSelectedRequest(null);
      setAssignmentData({
        workman_id: '',
        work_description: '',
        estimated_hours: '',
        materials_required: '',
        special_instructions: '',
      });
      Alert.alert('Success', 'Work order assigned successfully');
    } catch (error) {
      console.error('Error assigning work order:', error);
      Alert.alert('Error', 'Failed to assign work order');
    }
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
      default: return 'build';
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (filterPriority !== 'all' && request.priority !== filterPriority) return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const activeRequests = filteredRequests.filter(req => ['approved', 'assigned', 'in_progress'].includes(req.status));
  const completedRequests = filteredRequests.filter(req => req.status === 'completed');

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                { value: 'assigned', label: 'Assigned' },
                { value: 'completed', label: 'Completed' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={filterPriority}
              onValueChange={setFilterPriority}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Pending Approval ({pendingRequests.length})
            </Title>
            {pendingRequests.map((request) => (
              <Card key={request.id} style={styles.requestCard}>
                <Card.Content>
                  <View style={styles.requestHeader}>
                    <MaterialIcons 
                      name={getRequestTypeIcon(request.request_type)} 
                      size={24} 
                      color={getStatusColor(request.status)} 
                    />
                    <View style={styles.requestTitleContainer}>
                      <Title style={styles.requestTitle}>{request.title}</Title>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: getPriorityColor(request.priority) }}
                        style={{ borderColor: getPriorityColor(request.priority) }}
                      >
                        {request.priority}
                      </Chip>
                    </View>
                  </View>
                  <Paragraph style={styles.requestDescription}>
                    {request.description}
                  </Paragraph>
                  <View style={styles.requestDetails}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Property:</Text> {request.premises_name} - Unit {request.unit_number}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Tenant:</Text> {request.tenant_first_name} {request.tenant_last_name}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Estimated Cost:</Text> ${request.estimated_cost}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Requested:</Text> {new Date(request.requested_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setSelectedRequest(request);
                        setApprovalStatus('approved');
                        setApprovalModalVisible(true);
                      }}
                      style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    >
                      Approve
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setSelectedRequest(request);
                        setApprovalStatus('rejected');
                        setApprovalModalVisible(true);
                      }}
                      style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                    >
                      Reject
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Active Requests ({activeRequests.length})
            </Title>
            {activeRequests.map((request) => (
              <Card key={request.id} style={styles.requestCard}>
                <Card.Content>
                  <View style={styles.requestHeader}>
                    <MaterialIcons 
                      name={getRequestTypeIcon(request.request_type)} 
                      size={24} 
                      color={getStatusColor(request.status)} 
                    />
                    <View style={styles.requestTitleContainer}>
                      <Title style={styles.requestTitle}>{request.title}</Title>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: getStatusColor(request.status) }}
                        style={{ borderColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </Chip>
                    </View>
                  </View>
                  <Paragraph style={styles.requestDescription}>
                    {request.description}
                  </Paragraph>
                  <View style={styles.requestDetails}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Property:</Text> {request.premises_name} - Unit {request.unit_number}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Tenant:</Text> {request.tenant_first_name} {request.tenant_last_name}
                    </Text>
                    {request.work_order_number && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Work Order:</Text> {request.work_order_number}
                      </Text>
                    )}
                    {request.workman_first_name && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Assigned To:</Text> {request.workman_first_name} {request.workman_last_name}
                      </Text>
                    )}
                  </View>
                  {request.status === 'approved' && (
                    <Button
                      mode="contained"
                      onPress={() => {
                        setSelectedRequest(request);
                        setAssignmentModalVisible(true);
                      }}
                      style={styles.actionButton}
                    >
                      Assign Work Order
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              Completed Requests ({completedRequests.length})
            </Title>
            {completedRequests.map((request) => (
              <Card key={request.id} style={styles.requestCard}>
                <Card.Content>
                  <View style={styles.requestHeader}>
                    <MaterialIcons 
                      name={getRequestTypeIcon(request.request_type)} 
                      size={24} 
                      color={getStatusColor(request.status)} 
                    />
                    <View style={styles.requestTitleContainer}>
                      <Title style={styles.requestTitle}>{request.title}</Title>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: getStatusColor(request.status) }}
                        style={{ borderColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </Chip>
                    </View>
                  </View>
                  <Paragraph style={styles.requestDescription}>
                    {request.description}
                  </Paragraph>
                  <View style={styles.requestDetails}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Property:</Text> {request.premises_name} - Unit {request.unit_number}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Tenant:</Text> {request.tenant_first_name} {request.tenant_last_name}
                    </Text>
                    {request.work_order_number && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Work Order:</Text> {request.work_order_number}
                      </Text>
                    )}
                    {request.completed_date && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Completed:</Text> {new Date(request.completed_date).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  {request.tenant_rating && (
                    <View style={styles.ratingContainer}>
                      <Text style={styles.detailLabel}>Tenant Rating:</Text>
                      <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <MaterialIcons
                            key={star}
                            name={star <= request.tenant_rating! ? 'star' : 'star-border'}
                            size={20}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                      {request.tenant_feedback && (
                        <Text style={styles.feedbackText}>"{request.tenant_feedback}"</Text>
                      )}
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Work Orders Summary */}
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>
            Work Orders Summary
          </Title>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Work Orders:</Text>
                <Badge style={styles.summaryBadge}>{workOrders.length}</Badge>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>In Progress:</Text>
                <Badge style={[styles.summaryBadge, { backgroundColor: '#FF9800' }]}>
                  {workOrders.filter(wo => wo.status === 'in_progress').length}
                </Badge>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Completed:</Text>
                <Badge style={[styles.summaryBadge, { backgroundColor: '#4CAF50' }]}>
                  {workOrders.filter(wo => wo.status === 'completed').length}
                </Badge>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Approval Modal */}
      <Portal>
        <Modal
          visible={approvalModalVisible}
          onDismiss={() => setApprovalModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>
            {approvalStatus === 'approved' ? 'Approve' : 'Reject'} Maintenance Request
          </Title>
          <TextInput
            label="Comments (optional)"
            value={approvalComments}
            onChangeText={setApprovalComments}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setApprovalModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleApproveRequest}
              style={[
                styles.modalButton,
                { backgroundColor: approvalStatus === 'approved' ? '#4CAF50' : '#F44336' }
              ]}
            >
              {approvalStatus === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Assignment Modal */}
      <Portal>
        <Modal
          visible={assignmentModalVisible}
          onDismiss={() => setAssignmentModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Assign Work Order</Title>
          <TextInput
            label="Work Description"
            value={assignmentData.work_description}
            onChangeText={(text) => setAssignmentData(prev => ({ ...prev, work_description: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
          />
          <TextInput
            label="Estimated Hours"
            value={assignmentData.estimated_hours}
            onChangeText={(text) => setAssignmentData(prev => ({ ...prev, estimated_hours: text }))}
            mode="outlined"
            keyboardType="numeric"
            style={styles.modalInput}
          />
          <TextInput
            label="Materials Required"
            value={assignmentData.materials_required}
            onChangeText={(text) => setAssignmentData(prev => ({ ...prev, materials_required: text }))}
            mode="outlined"
            style={styles.modalInput}
          />
          <TextInput
            label="Special Instructions"
            value={assignmentData.special_instructions}
            onChangeText={(text) => setAssignmentData(prev => ({ ...prev, special_instructions: text }))}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setAssignmentModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAssignWorkOrder}
              style={styles.modalButton}
            >
              Assign
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
  filterCard: {
    margin: 16,
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
  requestCard: {
    marginBottom: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitleContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 16,
    flex: 1,
  },
  requestDescription: {
    marginBottom: 12,
    color: '#666',
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailText: {
    marginBottom: 4,
    fontSize: 14,
    color: '#555',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 12,
  },
  summaryCard: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryBadge: {
    fontSize: 16,
  },
  ratingContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  feedbackText: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
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

export default LandlordMaintenanceScreen; 