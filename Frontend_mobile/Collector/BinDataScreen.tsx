import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addWasteCollection, getLastWasteCollectionID } from '../controller/wasteCollectionController'; // Assuming you have this function to handle the submission
import moment from 'moment'; // To handle date formatting
import { getCollectorDetails } from "../controller/collectorController";
import { resetBinWasteLevel } from "../controller/BinController"; // Import your reset function

export default function BinDataScreen({ route }) {
  const [user, setUser] = useState(null);
  const { binData } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCollectorDetails();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Helper function to generate the next collectionID
  const generateNextCollectionID = async () => {
    try {
      const lastCollectionID = await getLastWasteCollectionID();
      if (lastCollectionID) {
        // Increment the last collection ID (e.g., "C004" becomes "C005")
        const numericPart = parseInt(lastCollectionID.substring(1)); // Get the numeric part of the ID
        const nextNumericPart = numericPart + 1;
        return `P${nextNumericPart.toString().padStart(3, '0')}`; // Format with leading zeros if necessary
      } else {
        // If no collections exist, start with "C001"
        return "P001";
      }
    } catch (error) {
      console.error("Error generating collectionID:", error);
      throw new Error("Failed to generate collectionID");
    }
  };

  // Handle the "Collect Waste" button press
  const handleCollectWaste = async () => {
    try {
      // Generate the next collectionID
      const newCollectionID = await generateNextCollectionID();
   console.log()
      // Prepare data for submission
      const collectionDetails = {
        collectionID: newCollectionID, // Use the generated collectionID
        binID: binData.binID,
        User:binData.user,
        WasteType:binData.type,
        collectorID: user.collectorID,
        collectorname: user.name,
        wasteLevel: binData.wasteLevel, // Assuming this is static, but you can update as needed
        collectionDate: moment().format('YYYY-MM-DD HH:mm:ss'), // Current date and time
Payback: binData.type.incentives,
        PerKg: binData.type.price
        ,
      };

      

      // Call the function to submit the collection details
      await addWasteCollection(collectionDetails);

      // Reset the waste level of the bin to 0
      await resetBinWasteLevel(binData.id);

      // Navigate back to the dashboard or the desired screen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to collect waste", error);
      Alert.alert("Error", "Failed to collect waste. Please try again.");
    }
  };

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
              <InfoItem label="Waste level" value={binData.wasteLevel} />
              <InfoItem label="Waste type" value={binData.type.wasteType} />
              <InfoItem label="Recyclable" value="yes" />
              <InfoItem label="Cost per Kg" value={binData.perKg} />
            </View>
          </View>
        ) : (
          <Text>No data available</Text>
        )}

        <TouchableOpacity style={styles.collectButton} onPress={handleCollectWaste}>
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
