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
  tenant_rating?: number;
  tenant_feedback?: string;
  work_order_number?: string;
  work_order_status?: string;
  workman_first_name?: string;
  workman_last_name?: string;
}

const MaintenanceRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    request_type: 'routine',
    priority: 'medium',
    premises_id: '',
    rental_unit_id: '',
    estimated_cost: '',
  });

  const [ratingData, setRatingData] = useState({
    rating: 5,
    feedback: '',
  });

  const requestTypes = [
    { value: 'routine', label: 'Routine', icon: 'wrench' },
    { value: 'urgent', label: 'Urgent', icon: 'alert' },
    { value: 'emergency', label: 'Emergency', icon: 'fire' },
    { value: 'preventive', label: 'Preventive', icon: 'shield' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#4caf50' },
    { value: 'medium', label: 'Medium', color: '#ff9800' },
    { value: 'high', label: 'High', color: '#f44336' },
    { value: 'critical', label: 'Critical', color: '#9c27b0' },
  ];

  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  useEffect(() => {
    loadMaintenanceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, maintenanceRequests]);

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
          tenant_rating: 5,
          tenant_feedback: 'Excellent work! The faucet is working perfectly now.',
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
        },
      ]);
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
      Alert.alert('Error', 'Failed to load maintenance requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = maintenanceRequests;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.premises_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/maintenance-requests', newRequest);
      // await loadMaintenanceRequests();
      
      // Mock success
      setModalVisible(false);
      setNewRequest({
        title: '',
        description: '',
        request_type: 'routine',
        priority: 'medium',
        premises_id: '',
        rental_unit_id: '',
        estimated_cost: '',
      });
      await loadMaintenanceRequests();
      Alert.alert('Success', 'Maintenance request created successfully');
    } catch (error) {
      console.error('Failed to create maintenance request:', error);
      Alert.alert('Error', 'Failed to create maintenance request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateRequest = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post(`/maintenance-requests/${selectedRequest.id}/rate`, ratingData);
      // await loadMaintenanceRequests();
      
      // Mock success
      setRatingModalVisible(false);
      setRatingData({ rating: 5, feedback: '' });
      await loadMaintenanceRequests();
      Alert.alert('Success', 'Rating submitted successfully');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      Alert.alert('Error', 'Failed to submit rating');
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
    const priorityInfo = priorities.find(p => p.value === priority);
    return priorityInfo?.color || '#9e9e9e';
  };

  const getRequestTypeIcon = (type: string) => {
    const typeInfo = requestTypes.find(t => t.value === type);
    return typeInfo?.icon || 'wrench';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaintenanceRequests();
    setRefreshing(false);
  };

  const openRatingModal = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setRatingModalVisible(true);
  };

  const navigateToDetails = (request: MaintenanceRequest) => {
    navigation.navigate('MaintenanceRequestDetails' as never, { requestId: request.id } as never);
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
          <Title style={styles.title}>Maintenance Requests</Title>
          <Text style={styles.subtitle}>
            Submit and track maintenance requests for your rental unit
          </Text>
        </Surface>

        <Searchbar
          placeholder="Search requests..."
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
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(request.status) }}
                    style={styles.statusChip}
                  >
                    {request.status.replace('_', ' ').toUpperCase()}
                  </Chip>
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
                    <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                    <Text style={styles.infoText}>{request.premises_address}</Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getPriorityColor(request.priority) }}
                    style={styles.tagChip}
                  >
                    {request.priority.toUpperCase()}
                  </Chip>
                  
                  <Chip
                    mode="outlined"
                    style={styles.tagChip}
                  >
                    {request.request_type.replace('_', ' ').toUpperCase()}
                  </Chip>

                  {request.estimated_cost && (
                    <Chip mode="outlined" style={styles.tagChip}>
                      ${request.estimated_cost}
                    </Chip>
                  )}
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

                {request.status === 'completed' && !request.tenant_rating && (
                  <Button
                    mode="outlined"
                    onPress={() => openRatingModal(request)}
                    style={styles.rateButton}
                    icon="star"
                  >
                    Rate This Request
                  </Button>
                )}

                {request.tenant_rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Your Rating:</Text>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons
                          key={star}
                          name={star <= request.tenant_rating! ? 'star' : 'star-outline'}
                          size={20}
                          color="#ffd700"
                        />
                      ))}
                    </View>
                    {request.tenant_feedback && (
                      <Text style={styles.feedback}>{request.tenant_feedback}</Text>
                    )}
                  </View>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {filteredRequests.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="wrench" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Maintenance Requests</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No requests match your current filters.' 
                : 'You haven\'t submitted any maintenance requests yet.'}
            </Text>
          </Surface>
        )}
      </ScrollView>

      {/* Create Request Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>Submit Maintenance Request</Title>

            <TextInput
              label="Title *"
              value={newRequest.title}
              onChangeText={(text) => setNewRequest(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description *"
              value={newRequest.description}
              onChangeText={(text) => setNewRequest(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.sectionTitle}>Request Type</Text>
            <SegmentedButtons
              value={newRequest.request_type}
              onValueChange={(value) => setNewRequest(prev => ({ ...prev, request_type: value }))}
              buttons={requestTypes.map(type => ({ value: type.value, label: type.label }))}
              style={styles.segmentedButtons}
            />

            <Text style={styles.sectionTitle}>Priority Level</Text>
            <SegmentedButtons
              value={newRequest.priority}
              onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value }))}
              buttons={priorities.map(priority => ({ value: priority.value, label: priority.label }))}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Estimated Cost (Optional)"
              value={newRequest.estimated_cost}
              onChangeText={(text) => setNewRequest(prev => ({ ...prev, estimated_cost: text }))}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="0.00"
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
                onPress={handleCreateRequest}
                style={styles.modalButton}
                loading={isLoading}
                disabled={isLoading || !newRequest.title.trim() || !newRequest.description.trim()}
              >
                Submit Request
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Rating Modal */}
      <Portal>
        <Modal
          visible={ratingModalVisible}
          onDismiss={() => setRatingModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Rate Maintenance Request</Title>
          
          <Text style={styles.ratingQuestion}>
            How would you rate the quality of this maintenance work?
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name={star <= ratingData.rating ? 'star' : 'star-outline'}
                size={40}
                color="#ffd700"
                onPress={() => setRatingData(prev => ({ ...prev, rating: star }))}
                style={styles.starButton}
              />
            ))}
          </View>

          <Text style={styles.ratingText}>{ratingData.rating} out of 5 stars</Text>

          <TextInput
            label="Additional Feedback (Optional)"
            value={ratingData.feedback}
            onChangeText={(text) => setRatingData(prev => ({ ...prev, feedback: text }))}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Tell us about your experience..."
          />

          <View style={styles.modalActions}>
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
              loading={isLoading}
              disabled={isLoading}
            >
              Submit Rating
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
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
  statusFilter: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  statusChip: {
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 4,
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
  rateButton: {
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  feedback: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  segmentedButtons: {
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
  ratingQuestion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default MaintenanceRequestsScreen; 