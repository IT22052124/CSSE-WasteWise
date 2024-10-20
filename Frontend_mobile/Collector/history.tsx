import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  getCollectorRecords,
  getCollectorDetails,
} from "../controller/collectorController";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";


//function of collectedHistory screen
export default function CollectedHistoryScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  //function to get collector details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCollectorDetails();
        setUser(userData.collectorID);
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
        setError("Failed to fetch user details. Please try again.");
      }
    };
    fetchUserDetails();
  }, []);

  //fetch records
  const fetchRecords = async () => {
    if (!user) return;

    try {
      const collectedRecords = await getCollectorRecords(user);
      setRecords(collectedRecords);
      console.log("Collected Records:", collectedRecords);
    } catch (err) {
      console.error("Failed to fetch collected records:", err);
      setError("Failed to fetch collected records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading before fetch
      fetchRecords();

      return () => {
        setRecords([]); // Optional: Clear records if needed when the screen loses focus
      };
    }, [user])
  );
  // render history records
  const renderRecords = () => {
    if (records.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="inbox" size={64} color="#ccc" />
          <Text style={styles.noDataText}>No collected records for today.</Text>
        </View>
      );
    }

    return records.map((record) => (
      <View key={record.id} style={styles.recordItem}>
        <View style={styles.recordHeader}>
          <MaterialIcons name="local-shipping" size={24} color="#2ecc71" />
          <Text style={styles.recordId}>
            Collection ID: {record.collectionID}
          </Text>
        </View>
        <View style={styles.recordBody}>
          <View style={styles.recordDetail}>
            <MaterialIcons name="scale" size={20} color="#7f8c8d" />
            <Text style={styles.recordText}>{record.wasteWeight} KG</Text>
          </View>
          <View style={styles.recordDetail}>
            <MaterialIcons name="event" size={20} color="#2980B9" />
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>From:</Text>
              <Text style={styles.dateText}>
                {moment(record.collectionDate).format("MMM DD, YYYY")}
              </Text>
              <Text style={styles.timeText}>
                {moment(record.collectionDate).format("hh:mm A")}
              </Text>
            </View>
          </View>
          <View style={styles.recordDetail}>
            <MaterialIcons name="delete" size={20} color="#7f8c8d" />
            <Text style={styles.recordText}>{record.binID}</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Collected Waste History</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2ecc71"
              style={styles.loader}
            />
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            renderRecords()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2980B9",
    marginBottom: 20,
    textAlign: "center",
  },
  recordItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  recordId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  recordBody: {
    padding: 16,
  },
  recordDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recordText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  dateContainer: {
    marginLeft: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 2,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 16,
  },
  loader: {
    marginTop: 40,
  },
});
