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
  Chip,
  useTheme,
  Searchbar,
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface MaintenanceRequest {
  id: number;
  lease_id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  unit_number: string;
  premises_name: string;
  created_at: string;
  updated_at: string;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
}

const MaintenanceRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });

  const priorities = ['low', 'medium', 'high', 'urgent'];
  const categories = ['general', 'plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest_control'];
  const statuses = ['pending', 'in_progress', 'scheduled', 'completed', 'cancelled'];

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, requests]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/maintenance-requests?role=lessee');
      // setRequests(response.data.requests);
      
      // Mock data for now
      setRequests([
        {
          id: 1,
          lease_id: 1,
          title: 'Leaky Faucet in Kitchen',
          description: 'The kitchen faucet has been dripping constantly for the past week. It\'s wasting water and making noise.',
          priority: 'medium',
          status: 'in_progress',
          category: 'plumbing',
          unit_number: 'A101',
          premises_name: 'Sunset Gardens Apartments',
          created_at: '2024-01-15',
          updated_at: '2024-01-20',
          scheduled_date: '2024-01-25',
          notes: 'Plumber scheduled for next week. Please ensure access to the unit.',
        },
        {
          id: 2,
          lease_id: 1,
          title: 'AC Not Cooling Properly',
          description: 'The air conditioning unit is running but not cooling the apartment effectively. Temperature stays around 78°F.',
          priority: 'high',
          status: 'pending',
          category: 'hvac',
          unit_number: 'A101',
          premises_name: 'Sunset Gardens Apartments',
          created_at: '2024-01-18',
          updated_at: '2024-01-18',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load maintenance requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.unit_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
    });
    setEditingRequest(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (requestData: MaintenanceRequest) => {
    setFormData({
      title: requestData.title,
      description: requestData.description,
      priority: requestData.priority,
      category: requestData.category,
    });
    setEditingRequest(requestData);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingRequest) {
        // TODO: Replace with actual API call
        // await api.put(`/maintenance-requests/${editingRequest.id}`, formData);
        Alert.alert('Success', 'Maintenance request updated successfully');
      } else {
        // TODO: Replace with actual API call
        // await api.post('/maintenance-requests', formData);
        Alert.alert('Success', 'Maintenance request created successfully');
      }
      
      setModalVisible(false);
      resetForm();
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to save maintenance request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (requestId: number) => {
    Alert.alert(
      'Delete Maintenance Request',
      'Are you sure you want to delete this maintenance request? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await api.delete(`/maintenance-requests/${requestId}`);
              Alert.alert('Success', 'Maintenance request deleted successfully');
              loadRequests();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete maintenance request');
            }
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#2196f3';
      case 'scheduled': return '#ff9800';
      case 'pending': return '#9e9e9e';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCategoryLabel = (category: string) => {
    return category.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
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
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
          style={styles.filterButtons}
        />

        {filteredRequests.map((request) => (
          <Card key={request.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>{request.title}</Title>
                <View style={styles.statusContainer}>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getPriorityColor(request.priority) }}
                    style={styles.priorityChip}
                  >
                    {getPriorityLabel(request.priority)}
                  </Chip>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(request.status) }}
                  >
                    {getStatusLabel(request.status)}
                  </Chip>
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <Chip mode="outlined" style={styles.chip}>
                  {getCategoryLabel(request.category)}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  Unit {request.unit_number}
                </Chip>
                <Chip mode="outlined" style={styles.chip}>
                  {request.premises_name}
                </Chip>
              </View>

              <Text style={styles.description}>{request.description}</Text>

              <View style={styles.requestDetails}>
                <View style={styles.requestDetail}>
                  <Text style={styles.requestLabel}>Created:</Text>
                  <Text style={styles.requestValue}>
                    {new Date(request.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.requestDetail}>
                  <Text style={styles.requestLabel}>Updated:</Text>
                  <Text style={styles.requestValue}>
                    {new Date(request.updated_at).toLocaleDateString()}
                  </Text>
                </View>
                {request.scheduled_date && (
                  <View style={styles.requestDetail}>
                    <Text style={styles.requestLabel}>Scheduled:</Text>
                    <Text style={styles.requestValue}>
                      {new Date(request.scheduled_date).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {request.completed_date && (
                  <View style={styles.requestDetail}>
                    <Text style={styles.requestLabel}>Completed:</Text>
                    <Text style={styles.requestValue}>
                      {new Date(request.completed_date).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              {request.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesTitle}>Notes:</Text>
                  <Text style={styles.notesText}>{request.notes}</Text>
                </View>
              )}
            </Card.Content>
            
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => openEditModal(request)}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleDelete(request.id)}
                icon="delete"
                textColor="#f44336"
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {filteredRequests.length === 0 && !isLoading && (
          <Surface style={styles.emptyState}>
            <MaterialCommunityIcons name="wrench" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Maintenance Requests Found</Title>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'No requests match your search criteria.' 
                : 'You don\'t have any maintenance requests yet.'}
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
              {isEditing ? 'Edit Maintenance Request' : 'Submit New Request'}
            </Title>

            <TextInput
              label="Request Title *"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />

            <TextInput
              label="Priority"
              value={formData.priority}
              onChangeText={(text) => setFormData(prev => ({ ...prev, priority: text }))}
              mode="outlined"
              style={styles.input}
              list={priorities.join(',')}
            />

            <TextInput
              label="Category"
              value={formData.category}
              onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
              mode="outlined"
              style={styles.input}
              list={categories.join(',')}
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
                {isEditing ? 'Update' : 'Submit'}
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
  priorityChip: {
    marginRight: 8,
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
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  requestDetails: {
    marginBottom: 16,
  },
  requestDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  requestValue: {
    fontSize: 14,
    color: '#6200ee',
  },
  notesContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    opacity: 0.8,
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

export default MaintenanceRequestsScreen; 