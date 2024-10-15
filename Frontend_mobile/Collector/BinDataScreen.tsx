import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type BinDataScreenRouteProp = RouteProp<RootStackParamList, 'BinData'>;

type Props = {
  route: BinDataScreenRouteProp;
};

export default function BinDataScreen({ route }: Props) {
  const { binId } = route.params;

  // Fetch bin data using binId
  // This is a placeholder for the actual data
  const binData = {
    id: binId,
    location: '123 Main St',
    lastEmptied: '2023-05-01',
    currentCapacity: '75%',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bin Data</Text>
      <Text>Bin ID: {binData.id}</Text>
      <Text>Location: {binData.location}</Text>
      <Text>Last Emptied: {binData.lastEmptied}</Text>
      <Text>Current Capacity: {binData.currentCapacity}</Text>
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
    marginBottom: 16,
  },
});