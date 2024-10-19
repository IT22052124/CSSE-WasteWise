import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CollectionTask = {
  id: string;
  address: string;
  time: string;
};

const dummyTasks: CollectionTask[] = [
  { id: '1', address: '123 Main St', time: '09:00 AM' },
  { id: '2', address: '456 Elm St', time: '10:30 AM' },
  { id: '3', address: '789 Oak St', time: '02:00 PM' },
  { id: '4', address: '101 Pine St', time: '04:15 PM' },
  { id: '5', address: '202 Maple Ave', time: '05:30 PM' },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const renderItem = ({ item, index }: { item: CollectionTask; index: number }) => {
    return (
      <Animated.View style={styles.taskItem}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="home" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.taskDetails}>
          <Text style={styles.taskAddress}>{item.address}</Text>
          <Text style={styles.taskTime}>{item.time}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Collection Tasks</Text>
      <AnimatedFlatList
        data={dummyTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  listContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#3498DB',
    borderRadius: 50,
    padding: 10,
    marginRight: 15,
  },
  taskDetails: {
    flex: 1,
  },
  taskAddress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  taskTime: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});