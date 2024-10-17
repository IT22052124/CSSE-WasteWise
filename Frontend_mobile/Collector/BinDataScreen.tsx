import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../storage/firebase"; // Adjust the import based on your file structure
import { RootStackParamList } from '../App';

type BinDataScreenRouteProp = RouteProp<RootStackParamList, 'BinData'>;

type Props = {
  route: BinDataScreenRouteProp;
};

export default function BinDataScreen({ route }: Props) {
  const { binData } = route.params;
  console.log(binData);
  // [binData, setBinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bin Data</Text>
      {binData ? (
        <>
          <Text>Bin ID: {binData.binID}</Text>
          <Text>Location: {binData.user.address}</Text>
          <Text>Last Emptied: {binData.user.username}</Text>
          
        </>
      ) : (
        <Text>No data available</Text>
      )}
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
