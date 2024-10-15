import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type CollectionTask = {
  id: string;
  address: string;
  time: string;
};

const dummyTasks: CollectionTask[] = [
  { id: '1', address: '123 Main St', time: '09:00 AM' },
  { id: '2', address: '456 Elm St', time: '10:30 AM' },
  { id: '3', address: '789 Oak St', time: '02:00 PM' },
];

export default function HomeScreen() {
  const renderItem = ({ item }: { item: CollectionTask }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskAddress}>{item.address}</Text>
      <Text style={styles.taskTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Collection Tasks</Text>
      <FlatList
        data={dummyTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  taskAddress: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
  },
});