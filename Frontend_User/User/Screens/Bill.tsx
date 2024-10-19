import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getWasteCollectionsByUserID,
  getTotalPaymentByUserID,
} from "./../../Controller/paymentController";
import { getUserDetails } from "../../Controller/UserController";

type Bill = {
  month: string;
  totalAmount: number;
  totalPayBackAmount: number;
  totalWaste: number;
  totalAmountToBePaid: number;
};

export default function BillHistory() {
  const navigation = useNavigation();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [userID, setUserID] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [finalToPaid, setFinalToPaid] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDetails();
        setUserID(userData.id);
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  const fetchBills = async () => {
    try {
      const userData = await getUserDetails();
      if (userData) {
        const fetchedBills = await getWasteCollectionsByUserID(userData.id);
        setBills(fetchedBills);

        // Calculate outstanding amount from fetched bills
        const totalOutstanding = fetchedBills.reduce(
          (total, bill) => total + bill.totalAmountToBePaid,
          0
        );
        setOutstandingAmount(totalOutstanding);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const userData = await getUserDetails();
      if (userData) {
        const data = await getTotalPaymentByUserID(userData.id);

        setTotalPayment(data);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBills();
      fetchPayments();
    }, [userID])
  );

  useEffect(() => {
    setFinalToPaid(outstandingAmount - totalPayment);
  }, [outstandingAmount, totalPayment]);

  const renderItem = ({ item }: { item: Bill }) => (
    <View style={styles.billItem}>
      <View style={styles.monthContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
        <Text style={styles.month}>{item.month}</Text>
      </View>
      <View style={styles.amountsContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Amount:</Text>
          <Text style={styles.amount}>LKR {item.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Payback:</Text>
          <Text style={styles.amount}>
            LKR {item.totalPayBackAmount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Net Amount:</Text>
          <Text style={styles.amount}>
            LKR {item.totalAmountToBePaid.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const handlePayment = () => {
    navigation.navigate("PaymentPage", { amount: finalToPaid });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill History</Text>
        <View style={styles.outstandingContainer}>
          <Text style={styles.outstandingLabel}>Outstanding</Text>
          <Text style={styles.outstandingAmount}>
            LKR {finalToPaid.toFixed(2)}
          </Text>
        </View>
      </View>
      <FlatList
        data={bills}
        renderItem={renderItem}
        keyExtractor={(item) => item.month}
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
    color: "#333333",
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
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#4CAF50",
  },
});
