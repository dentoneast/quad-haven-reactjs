import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Surface, useTheme, List, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PropertiesScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <Title style={[styles.title, { color: theme.colors.onPrimary }]}>
          Properties
        </Title>
      </Surface>

      <ScrollView style={styles.content}>
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <List.Section>
            <List.Subheader>Available Properties</List.Subheader>
            <List.Item
              title="Property Management Coming Soon"
              description="This feature will be available in the next update"
              left={(props) => <List.Icon {...props} icon="home-variant" />}
            />
          </List.Section>
        </Surface>

        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.button}
        >
          Add Property
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
  },
  button: {
    marginTop: 16,
  },
});

export default PropertiesScreen;