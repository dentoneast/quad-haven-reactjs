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
  work_order_description?: string;
  estimated_hours?: number;
  actual_hours?: number;
  work_order_notes?: string;
}

const MaintenanceRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [newRequestModalVisible, setNewRequestModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    request_type: 'routine' as MaintenanceRequest['request_type'],
    priority: 'medium' as MaintenanceRequest['priority'],
  });
  const [ratingData, setRatingData] = useState({
    rating: 5,
    feedback: '',
  });

  // Mock data for demonstration
  const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
      id: 1,
      title: 'Leaky Kitchen Faucet',
      description: 'The kitchen faucet is dripping constantly and needs repair.',
      request_type: 'routine',
      priority: 'medium',
      status: 'completed',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '101',
      estimated_cost: '150.00',
      requested_date: '2024-01-15T15:00:00Z',
      approved_date: '2024-01-16T09:00:00Z',
      assigned_date: '2024-01-17T08:00:00Z',
      started_date: '2024-01-18T09:00:00Z',
      completed_date: '2024-01-18T14:00:00Z',
      work_order_number: 'WO-2024-001',
      work_order_status: 'completed',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
      work_order_description: 'Replace kitchen faucet cartridge and fix water leak under sink',
      estimated_hours: 2,
      actual_hours: 2.5,
      work_order_notes: 'Replaced cartridge and sealed all connections. No more leaks.',
    },
    {
      id: 2,
      title: 'Broken Window Lock',
      description: 'The lock on the bedroom window is broken and won\'t secure properly.',
      request_type: 'urgent',
      priority: 'high',
      status: 'in_progress',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '101',
      estimated_cost: '75.00',
      requested_date: '2024-01-20T19:00:00Z',
      approved_date: '2024-01-20T21:00:00Z',
      assigned_date: '2024-01-21T09:00:00Z',
      started_date: '2024-01-21T10:00:00Z',
      work_order_number: 'WO-2024-002',
      work_order_status: 'in_progress',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
      work_order_description: 'Replace broken window lock mechanism',
      estimated_hours: 1,
      work_order_notes: 'Started work on window lock replacement',
    },
    {
      id: 3,
      title: 'HVAC System Not Working',
      description: 'The air conditioning unit is not cooling properly.',
      request_type: 'emergency',
      priority: 'critical',
      status: 'assigned',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '101',
      estimated_cost: '300.00',
      requested_date: '2024-01-18T10:00:00Z',
      approved_date: '2024-01-18T14:00:00Z',
      assigned_date: '2024-01-19T09:00:00Z',
      work_order_number: 'WO-2024-004',
      work_order_status: 'assigned',
      workman_first_name: 'Tom',
      workman_last_name: 'Anderson',
      work_order_description: 'Inspect and repair HVAC system',
      estimated_hours: 3,
    },
    {
      id: 4,
      title: 'Garbage Disposal Jammed',
      description: 'The garbage disposal is stuck and won\'t turn on.',
      request_type: 'routine',
      priority: 'medium',
      status: 'pending',
      premises_name: 'Sunset Gardens Apartments',
      unit_number: '101',
      estimated_cost: '120.00',
      requested_date: '2024-01-22T14:00:00Z',
    },
  ];

  useEffect(() => {
    loadMaintenanceRequests();
  }, []);

  const loadMaintenanceRequests = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/maintenance-requests?tenant_id=' + user?.id);
      // const data = await response.json();
      
      // For now, use mock data
      setMaintenanceRequests(mockMaintenanceRequests);
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
      Alert.alert('Error', 'Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaintenanceRequests();
    setRefreshing(false);
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/maintenance-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRequest),
      // });

      // Create new request with mock data
      const newMaintenanceRequest: MaintenanceRequest = {
        id: Date.now(),
        ...newRequest,
        status: 'pending',
        premises_name: 'Sunset Gardens Apartments',
        unit_number: '101',
        estimated_cost: '0.00',
        requested_date: new Date().toISOString(),
      };

      setMaintenanceRequests(prev => [newMaintenanceRequest, ...prev]);
      setNewRequestModalVisible(false);
      setNewRequest({
        title: '',
        description: '',
        request_type: 'routine',
        priority: 'medium',
      });
      Alert.alert('Success', 'Maintenance request created successfully');
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      Alert.alert('Error', 'Failed to create maintenance request');
    }
  };

  const handleRateRequest = async () => {
    if (!selectedRequest) return;

    try {
      // In a real app, this would be an API call
      // await fetch(`/api/maintenance-requests/${selectedRequest.id}/rate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(ratingData),
      // });

      // Update local state
      setMaintenanceRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, tenant_rating: ratingData.rating, tenant_feedback: ratingData.feedback }
            : req
        )
      );

      setRatingModalVisible(false);
      setSelectedRequest(null);
      setRatingData({ rating: 5, feedback: '' });
      Alert.alert('Success', 'Thank you for your feedback!');
    } catch (error) {
      console.error('Error rating maintenance request:', error);
      Alert.alert('Error', 'Failed to submit rating');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'approved': return 'check-circle';
      case 'rejected': return 'cancel';
      case 'assigned': return 'assignment';
      case 'in_progress': return 'engineering';
      case 'completed': return 'done-all';
      default: return 'schedule';
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    if (filterStatus !== 'all' && request.status !== filterStatus) return false;
    if (filterType !== 'all' && request.request_type !== filterType) return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const activeRequests = filteredRequests.filter(req => ['approved', 'assigned', 'in_progress'].includes(req.status));
  const completedRequests = filteredRequests.filter(req => req.status === 'completed');

  const getStatusProgress = (request: MaintenanceRequest) => {
    const steps = ['pending', 'approved', 'assigned', 'in_progress', 'completed'];
    const currentStep = steps.indexOf(request.status);
    return currentStep >= 0 ? (currentStep + 1) / steps.length : 0;
  };

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
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              style={styles.segmentedButtons}
            />
            <SegmentedButtons
              value={filterType}
              onValueChange={setFilterType}
              buttons={[
                { value: 'all', label: 'All Types' },
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'emergency', label: 'Emergency' },
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
                      <Text style={styles.detailLabel}>Estimated Cost:</Text> ${request.estimated_cost}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Requested:</Text> {new Date(request.requested_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.statusProgress}>
                    <Text style={styles.progressLabel}>Status Progress</Text>
                    <ProgressBar 
                      progress={getStatusProgress(request)} 
                      color={getStatusColor(request.status)}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Text>
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
                  
                  {request.work_order_number && (
                    <View style={styles.workOrderInfo}>
                      <Text style={styles.workOrderTitle}>Work Order Details</Text>
                      <View style={styles.workOrderDetails}>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>Work Order:</Text> {request.work_order_number}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>Assigned To:</Text> {request.workman_first_name} {request.workman_last_name}
                        </Text>
                        {request.work_order_description && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Work Description:</Text> {request.work_order_description}
                          </Text>
                        )}
                        {request.estimated_hours && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Estimated Hours:</Text> {request.estimated_hours}h
                          </Text>
                        )}
                        {request.actual_hours && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Actual Hours:</Text> {request.actual_hours}h
                          </Text>
                        )}
                      </View>
                      {request.work_order_notes && (
                        <View style={styles.workOrderNotes}>
                          <Text style={styles.notesLabel}>Workman Notes:</Text>
                          <Text style={styles.notesText}>{request.work_order_notes}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Property:</Text> {request.premises_name} - Unit {request.unit_number}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Estimated Cost:</Text> ${request.estimated_cost}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Requested:</Text> {new Date(request.requested_date).toLocaleDateString()}
                    </Text>
                    {request.approved_date && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Approved:</Text> {new Date(request.approved_date).toLocaleDateString()}
                      </Text>
                    )}
                    {request.assigned_date && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Assigned:</Text> {new Date(request.assigned_date).toLocaleDateString()}
                      </Text>
                    )}
                    {request.started_date && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Started:</Text> {new Date(request.started_date).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.statusProgress}>
                    <Text style={styles.progressLabel}>Status Progress</Text>
                    <ProgressBar 
                      progress={getStatusProgress(request)} 
                      color={getStatusColor(request.status)}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
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
                  
                  {request.work_order_number && (
                    <View style={styles.workOrderInfo}>
                      <Text style={styles.workOrderTitle}>Work Order Details</Text>
                      <View style={styles.workOrderDetails}>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>Work Order:</Text> {request.work_order_number}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.detailLabel}>Completed By:</Text> {request.workman_first_name} {request.workman_last_name}
                        </Text>
                        {request.work_order_description && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Work Description:</Text> {request.work_order_description}
                          </Text>
                        )}
                        {request.estimated_hours && request.actual_hours && (
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Time:</Text> {request.actual_hours}h actual vs {request.estimated_hours}h estimated
                          </Text>
                        )}
                      </View>
                      {request.work_order_notes && (
                        <View style={styles.workOrderNotes}>
                          <Text style={styles.notesLabel}>Completion Notes:</Text>
                          <Text style={styles.notesText}>{request.work_order_notes}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Property:</Text> {request.premises_name} - Unit {request.unit_number}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Estimated Cost:</Text> ${request.estimated_cost}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.detailLabel}>Requested:</Text> {new Date(request.requested_date).toLocaleDateString()}
                    </Text>
                    {request.completed_date && (
                      <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Completed:</Text> {new Date(request.completed_date).toLocaleDateString()}
                      </Text>
                    )}
                  </View>

                  <View style={styles.statusProgress}>
                    <Text style={styles.progressLabel}>Status Progress</Text>
                    <ProgressBar 
                      progress={getStatusProgress(request)} 
                      color={getStatusColor(request.status)}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>

                  {!request.tenant_rating && (
                    <Button
                      mode="contained"
                      onPress={() => {
                        setSelectedRequest(request);
                        setRatingModalVisible(true);
                      }}
                      style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                      icon="star"
                    >
                      Rate This Request
                    </Button>
                  )}

                  {request.tenant_rating && (
                    <View style={styles.ratingContainer}>
                      <Text style={styles.detailLabel}>Your Rating:</Text>
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

        {filteredRequests.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons name="build" size={64} color="#ccc" />
              <Title style={styles.emptyTitle}>No Maintenance Requests</Title>
              <Text style={styles.emptyText}>
                {filterStatus === 'all' && filterType === 'all'
                  ? 'You don\'t have any maintenance requests yet.'
                  : `No maintenance requests match your current filters.`}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* New Request Modal */}
      <Portal>
        <Modal
          visible={newRequestModalVisible}
          onDismiss={() => setNewRequestModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Create Maintenance Request</Title>
          
          <TextInput
            label="Title *"
            value={newRequest.title}
            onChangeText={(text) => setNewRequest(prev => ({ ...prev, title: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="Brief description of the issue"
          />

          <TextInput
            label="Description *"
            value={newRequest.description}
            onChangeText={(text) => setNewRequest(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.modalInput}
            placeholder="Detailed description of the problem..."
          />

          <Text style={styles.modalSectionTitle}>Request Type</Text>
          <SegmentedButtons
            value={newRequest.request_type}
            onValueChange={(value) => setNewRequest(prev => ({ ...prev, request_type: value as MaintenanceRequest['request_type'] }))}
            buttons={[
              { value: 'routine', label: 'Routine' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'emergency', label: 'Emergency' },
            ]}
            style={styles.modalSegmentedButtons}
          />

          <Text style={styles.modalSectionTitle}>Priority Level</Text>
          <SegmentedButtons
            value={newRequest.priority}
            onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value as MaintenanceRequest['priority'] }))}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
            style={styles.modalSegmentedButtons}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setNewRequestModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateRequest}
              style={styles.modalButton}
            >
              Submit Request
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Rating Modal */}
      <Portal>
        <Modal
          visible={ratingModalVisible}
          onDismiss={() => setRatingModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Rate This Request</Title>
          
          {selectedRequest && (
            <View style={styles.selectedRequestInfo}>
              <Text style={styles.selectedRequestTitle}>
                {selectedRequest.title}
              </Text>
              <Text style={styles.selectedRequestNumber}>
                {selectedRequest.work_order_number}
              </Text>
            </View>
          )}

          <Text style={styles.modalSectionTitle}>How would you rate the work?</Text>
          <View style={styles.ratingInputContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= ratingData.rating ? 'star' : 'star-border'}
                size={32}
                color="#FFD700"
                onPress={() => setRatingData(prev => ({ ...prev, rating: star }))}
                style={styles.ratingStar}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{ratingData.rating} out of 5 stars</Text>

          <TextInput
            label="Additional Feedback (Optional)"
            value={ratingData.feedback}
            onChangeText={(text) => setRatingData(prev => ({ ...prev, feedback: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Share your experience or suggestions..."
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setRatingModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleRateRequest}
              style={styles.modalButton}
            >
              Submit Rating
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* FAB for creating new requests */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setNewRequestModalVisible(true)}
        label="New Request"
      />
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
    marginBottom: 12,
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
  workOrderInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  workOrderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  workOrderDetails: {
    marginBottom: 8,
  },
  workOrderNotes: {
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#e65100',
  },
  notesText: {
    fontSize: 14,
    color: '#e65100',
  },
  statusProgress: {
    marginBottom: 16,
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
  actionButton: {
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 12,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  modalInput: {
    marginBottom: 12,
  },
  modalSegmentedButtons: {
    marginBottom: 16,
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
  selectedRequestInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedRequestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  selectedRequestNumber: {
    fontSize: 14,
    color: '#666',
  },
  ratingInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingStar: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});

export default MaintenanceRequestsScreen; 