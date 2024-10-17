import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

export default function BinDataScreen({ route }) {
  const { binData } = route.params;
  console.log(binData);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/bin.jpg')}
          style={styles.binImage}
        />
        
        {binData ? (
          <View style={styles.binInfo}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderText}>Bin Information</Text>
              <Text style={styles.star}>★</Text>
            </View>
            <View style={styles.infoGrid}>
              <InfoItem label="BIN ID" value={binData.binID} />
              <InfoItem label="Owner" value={binData.user.username} />
              <InfoItem label="Owner Phone" value={binData.user.phone} />
              <InfoItem label="Location" value={binData.user.address} />
              <InfoItem label="Waste level" value="90%" />
              <InfoItem label="Waste type" value={binData.type} />
              <InfoItem label="Recyclable" value="yes" />
              <InfoItem label="Cost per Kg" value={binData.perKg} />
            </View>
          </View>
        ) : (
          <Text>No data available</Text>
        )}
        
        <TouchableOpacity style={styles.collectButton}>
          <Text style={styles.collectButtonText}>Collect Waste</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  binImage: {
    width: 200,
    height: 240,
    resizeMode: 'contain',
  },
  binInfo: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  infoHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  star: {
    color: '#2ecc71',
    fontSize: 20,
  },
  collectButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16, // Increased for more height
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    width: 250,
    justifyContent: 'center', // Centers text vertically
    alignItems: 'center', // Centers text horizontally
},
collectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
},
});