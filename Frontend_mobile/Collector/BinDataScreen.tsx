import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  addWasteCollection,
  getBinTypeDetailsByID,
  getLastWasteCollectionID,
} from "../controller/wasteCollectionController"; // Assuming you have this function to handle the submission
import moment from "moment"; // To handle date formatting
import { getCollectorDetails } from "../controller/collectorController";
import { resetBinWasteLevel } from "../controller/BinController";
import { LogBox } from 'react-native';

//funcion for Bin Data screen
export default function BinDataScreen({ route }) {
  const [user, setUser] = useState(null);
  const { binData } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState({
    chargingPerKg: 0,
    incentivesPerKg: 0,
  });
  
// Ignore specific warning messages
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);
  const [weight, setWeight] = useState(0);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCollectorDetails();
        setUser(userData);
        const randomWasteLevel = generateRandomWeight();
        setWeight(randomWasteLevel);
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);
  // Function to generate a random weight between 1 and 25 kg
  const generateRandomWeight = () => {
    return Math.floor(Math.random() * (25 - 11 + 1)) + 11; // Generates a random number from 11 to 25
  };

  // Example usage
  const randomWeight = generateRandomWeight();
  console.log(randomWeight); // This will log a random number between 1 and 25

  const fetchBinTypeDetails = async () => {
    try {
      // Fetch details from Firebase
      const details = await getBinTypeDetailsByID(binData.wasteTypeRef);

      // Step 3: Set the returned item in the state
      if (details) {
        setAmount({
          chargingPerKg: details.chargingPerKg,
          incentivesPerKg: details.incentivesPerKg,
        });
      }
    } catch (error) {
      console.error("Error fetching binType details:", error);
    }
  };

  useEffect(() => {
    fetchBinTypeDetails();
  }, []);

  // Helper function to generate the next collectionID
  const generateNextCollectionID = async () => {
    try {
      const lastCollectionID = await getLastWasteCollectionID();
      if (lastCollectionID) {
        const numericPart = parseInt(lastCollectionID.substring(1));
        const nextNumericPart = numericPart + 1;
        return `P${nextNumericPart.toString().padStart(3, "0")}`;
      } else {
        return "P001";
      }
    } catch (error) {
      console.error("Error generating collectionID:", error);
      throw new Error("Failed to generate collectionID");
    }
  };
//store the values to send for the collection
  const handleCollectWaste = async () => {
    try {
      const newCollectionID = await generateNextCollectionID();
      const collectionDetails = {
        collectionID: newCollectionID,
        binID: binData.binID,
        userRef: binData.user.id,
        BinRef: binData.id,
        BinTypeRef: binData.type.id,
        User: binData.user,
        WasteType: binData.type,
        collectorID: user.collectorID,
        collectorname: user.name,
        wasteWeight: weight, // Assuming this is static, but you can update as needed
        collectionDate: moment().format("YYYY-MM-DD HH:mm:ss"), // Current date and time
        Payback: amount.incentivesPerKg,
        PerKg: amount.chargingPerKg,
      };

      await addWasteCollection(collectionDetails); //add waste collection
      await resetBinWasteLevel(binData.id); //reset bin level once the bin is collected
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to collect waste", error);
      Alert.alert("Error", "Failed to collect waste. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../assets/bin1.jpg")} style={styles.binImage} />

        {binData ? (
          <View style={styles.binInfo}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderText}>Bin Information</Text>
              <Text style={styles.star}>★</Text>
            </View>
            <View style={styles.infoGrid}>
              <InfoItem label="BIN ID" value={binData.binID} />
              <InfoItem label="Bin Size" value={binData.capacity} />
              <InfoItem label="Owner" value={binData.user.username} />

              <InfoItem label="Watse type" value={binData.type.binType} />
              <InfoItem label="Location" value={binData.user.address} />
              <InfoItem label="Weight (KG)" value={weight} />

              <InfoItem label="Owner Phone" value={binData.user.phone} />
              <InfoItem label="Recyclable" value={binData.type.recyclable} />
            </View>
          </View>
        ) : (
          <Text>No data available</Text>
        )}

        <TouchableOpacity
          style={styles.collectButton}
          onPress={handleCollectWaste}
        >
          <Text style={styles.collectButtonText}>Collect Waste</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>
      {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
    </Text>
  </View>
);

//styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  binImage: {
    width: 200,
    height: 240,
    resizeMode: "contain",
  },
  binInfo: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#f8f8f8",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  infoHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
  },
  star: {
    color: "#2ecc71",
    fontSize: 20,
  },
  collectButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  collectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});