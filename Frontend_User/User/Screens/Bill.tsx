import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Bill = {
  id: string;
  month: string;
  monthlyBill: number;
  payback: number;
};

const bills: Bill[] = [
  { id: "1", month: "January", monthlyBill: 1000, payback: 70 },
  { id: "2", month: "February", monthlyBill: 1000, payback: 70 },
  { id: "3", month: "March", monthlyBill: 1000, payback: 70 },
  { id: "4", month: "April", monthlyBill: 1000, payback: 70 },
  { id: "5", month: "May", monthlyBill: 1000, payback: 70 },
];

const outstandingAmount = 3500; // This should be calculated or fetched from your data source

export default function BillHistory() {
  const renderItem = ({ item }: { item: Bill }) => (
    <View style={styles.billItem}>
      <View style={styles.monthContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
        <Text style={styles.month}>{item.month}</Text>
      </View>
      <View style={styles.amountsContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Monthly Bill:</Text>
          <Text style={styles.amount}>₹{item.monthlyBill.toFixed(2)}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Payback:</Text>
          <Text style={styles.amount}>₹{item.payback.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const handlePayment = () => {
    // Implement payment logic here
    console.log("Payment initiated for outstanding amount:", outstandingAmount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill History</Text>
        <View style={styles.outstandingContainer}>
          <Text style={styles.outstandingLabel}>Outstanding</Text>
          <Text style={styles.outstandingAmount}>
            ₹{outstandingAmount.toFixed(2)}
          </Text>
        </View>
      </View>
      <FlatList
        data={bills}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Outstanding Amount</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 16,
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  outstandingContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    flexDirection: "column",
    alignItems: "center",
  },
  outstandingLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  outstandingAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  billItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  month: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginLeft: 8,
  },
  amountsContainer: {
    backgroundColor: "#F0F8F0",
    borderRadius: 8,
    padding: 10,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 16,
    color: "#333333",
  },
  amount: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  payButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
