import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
  TextInput,
  Portal,
  Modal,
  Accordion,
  Chip,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpSupportScreen: React.FC = () => {
  const { user } = useAuth();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [bugReportModalVisible, setBugReportModalVisible] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSteps, setBugSteps] = useState('');
  const [bugCategory, setBugCategory] = useState('general');

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a maintenance request?',
      answer: 'To create a maintenance request, go to the Maintenance section in your dashboard. Click on "Create Request" and fill out the required information including title, description, priority, and type.',
      category: 'maintenance'
    },
    {
      id: '2',
      question: 'How can I contact my landlord?',
      answer: 'You can contact your landlord through the Messages section. Navigate to Messages in the main menu and start a new conversation or continue an existing one.',
      category: 'communication'
    },
    {
      id: '3',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile screen and tap the edit button. You can update your personal information, contact details, and preferences there.',
      category: 'profile'
    },
    {
      id: '4',
      question: 'What should I do if I forgot my password?',
      answer: 'If you forgot your password, you can reset it from the login screen. Click on "Forgot Password" and follow the instructions sent to your email.',
      category: 'account'
    },
    {
      id: '5',
      question: 'How do I save a rental listing?',
      answer: 'When viewing a rental listing, you can save it by clicking the heart icon. Saved rentals will appear in your Saved Rentals section.',
      category: 'rentals'
    },
    {
      id: '6',
      question: 'How do I track my maintenance request status?',
      answer: 'You can track your maintenance request status in the Maintenance section. Each request shows its current status and any updates from your landlord or workman.',
      category: 'maintenance'
    }
  ];

  const handleContactSupport = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    try {
      // Here you would typically make an API call to send the support message
      // For now, we'll just show a success message
      Alert.alert('Success', 'Your message has been sent to support. We\'ll get back to you within 24 hours.');
      setContactModalVisible(false);
      setContactSubject('');
      setContactMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleBugReport = async () => {
    if (!bugDescription.trim()) {
      Alert.alert('Error', 'Please describe the bug');
      return;
    }

    try {
      // Here you would typically make an API call to submit the bug report
      // For now, we'll just show a success message
      Alert.alert('Success', 'Bug report submitted successfully. Our team will investigate and fix the issue.');
      setBugReportModalVisible(false);
      setBugDescription('');
      setBugSteps('');
      setBugCategory('general');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit bug report. Please try again.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return 'wrench';
      case 'communication': return 'message';
      case 'profile': return 'account';
      case 'account': return 'shield-account';
      case 'rentals': return 'home';
      default: return 'help-circle';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return '#FF9800';
      case 'communication': return '#2196F3';
      case 'profile': return '#4CAF50';
      case 'account': return '#9C27B0';
      case 'rentals': return '#F44336';
      default: return '#757575';
    }
  };

  const groupedFAQ = faqData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>Help & Support</Title>
            <Paragraph style={styles.headerSubtitle}>
              Find answers to common questions and get help when you need it
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={() => setContactModalVisible(true)}
                style={styles.quickActionButton}
                icon="message"
              >
                Contact Support
              </Button>
              <Button
                mode="outlined"
                onPress={() => setBugReportModalVisible(true)}
                style={styles.quickActionButton}
                icon="bug"
              >
                Report a Bug
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* FAQ Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Frequently Asked Questions</Title>
            <Paragraph style={styles.sectionSubtitle}>
              Find quick answers to common questions
            </Paragraph>
            
            {Object.entries(groupedFAQ).map(([category, items]) => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <MaterialIcons 
                    name={getCategoryIcon(category) as any} 
                    size={24} 
                    color={getCategoryColor(category)} 
                  />
                  <Text style={styles.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
                
                {items.map((item) => (
                  <Accordion
                    key={item.id}
                    title={item.question}
                    description={item.answer}
                    left={(props) => (
                      <MaterialIcons 
                        {...props} 
                        name="help-circle" 
                        size={24} 
                        color="#666" 
                      />
                    )}
                    style={styles.accordion}
                  />
                ))}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Contact Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Contact Information</Title>
            <List.Item
              title="Email Support"
              description="support@rentalapp.com"
              left={(props) => <List.Icon {...props} icon="email" />}
              onPress={() => Alert.alert('Email', 'support@rentalapp.com')}
            />
            <List.Item
              title="Phone Support"
              description="1-800-RENTAL-1"
              left={(props) => <List.Icon {...props} icon="phone" />}
              onPress={() => Alert.alert('Phone', '1-800-RENTAL-1')}
            />
            <List.Item
              title="Business Hours"
              description="Monday - Friday, 9 AM - 6 PM EST"
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
          </Card.Content>
        </Card>

        {/* User Guide */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>User Guide</Title>
            <Paragraph style={styles.sectionSubtitle}>
              Learn how to use the app effectively
            </Paragraph>
            
            <List.Item
              title="Getting Started"
              description="Learn the basics of using the rental app"
              left={(props) => <List.Icon {...props} icon="play-circle" />}
              onPress={() => Alert.alert('Guide', 'Getting Started guide coming soon')}
            />
            <List.Item
              title="Maintenance Requests"
              description="Complete guide to maintenance management"
              left={(props) => <List.Icon {...props} icon="wrench" />}
              onPress={() => Alert.alert('Guide', 'Maintenance guide coming soon')}
            />
            <List.Item
              title="Messaging System"
              description="How to communicate with landlords and tenants"
              left={(props) => <List.Icon {...props} icon="message-text" />}
              onPress={() => Alert.alert('Guide', 'Messaging guide coming soon')}
            />
            <List.Item
              title="Rental Management"
              description="Managing your rental properties and units"
              left={(props) => <List.Icon {...props} icon="home" />}
              onPress={() => Alert.alert('Guide', 'Rental management guide coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Troubleshooting */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Troubleshooting</Title>
            <Paragraph style={styles.sectionSubtitle}>
              Common issues and solutions
            </Paragraph>
            
            <List.Item
              title="App Not Loading"
              description="Try restarting the app or checking your internet connection"
              left={(props) => <List.Icon {...props} icon="refresh" />}
            />
            <List.Item
              title="Login Issues"
              description="Reset your password or check your email verification"
              left={(props) => <List.Icon {...props} icon="login" />}
            />
            <List.Item
              title="Notifications Not Working"
              description="Check your device settings and app permissions"
              left={(props) => <List.Icon {...props} icon="bell-off" />}
            />
            <List.Item
              title="Data Not Syncing"
              description="Pull to refresh or check your internet connection"
              left={(props) => <List.Icon {...props} icon="sync" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Contact Support Modal */}
      <Portal>
        <Modal
          visible={contactModalVisible}
          onDismiss={() => setContactModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Contact Support</Title>
          
          <TextInput
            mode="outlined"
            label="Subject"
            value={contactSubject}
            onChangeText={setContactSubject}
            style={styles.input}
            placeholder="Brief description of your issue"
          />
          
          <TextInput
            mode="outlined"
            label="Message"
            value={contactMessage}
            onChangeText={setContactMessage}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Describe your issue in detail..."
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setContactModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleContactSupport}
              style={styles.modalButton}
            >
              Send Message
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Bug Report Modal */}
      <Portal>
        <Modal
          visible={bugReportModalVisible}
          onDismiss={() => setBugReportModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Report a Bug</Title>
          
          <TextInput
            mode="outlined"
            label="Bug Category"
            value={bugCategory}
            onChangeText={setBugCategory}
            style={styles.input}
            disabled
          />
          
          <View style={styles.categoryChips}>
            <Chip
              selected={bugCategory === 'general'}
              onPress={() => setBugCategory('general')}
              style={styles.categoryChip}
            >
              General
            </Chip>
            <Chip
              selected={bugCategory === 'maintenance'}
              onPress={() => setBugCategory('maintenance')}
              style={styles.categoryChip}
            >
              Maintenance
            </Chip>
            <Chip
              selected={bugCategory === 'messaging'}
              onPress={() => setBugCategory('messaging')}
              style={styles.categoryChip}
            >
              Messaging
            </Chip>
            <Chip
              selected={bugCategory === 'rentals'}
              onPress={() => setBugCategory('rentals')}
              style={styles.categoryChip}
            >
              Rentals
            </Chip>
          </View>
          
          <TextInput
            mode="outlined"
            label="Bug Description"
            value={bugDescription}
            onChangeText={setBugDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Describe what went wrong..."
          />
          
          <TextInput
            mode="outlined"
            label="Steps to Reproduce"
            value={bugSteps}
            onChangeText={setBugSteps}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="What steps led to this issue? (optional)"
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setBugReportModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleBugReport}
              style={styles.modalButton}
            >
              Submit Report
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
    lineHeight: 20,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  accordion: {
    marginBottom: 8,
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
    fontSize: 20,
  },
  input: {
    marginBottom: 16,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
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

export default HelpSupportScreen;
