import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserDetails } from "../../Controller/UserController";
import { getBinTypes } from "../../Controller/BinController";
import { useFocusEffect } from "@react-navigation/native";

const BinPurchasePage = () => {
  const [binType, setBinType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState(0);
  const [charging, setCharging] = useState(0);
  const [incentives, setIncentives] = useState(0);
  const [recyclable, setRecyclable] = useState(false);
  const [binTypes, setBinTypes] = useState([]);
  const [availableCapacities, setAvailableCapacities] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasteTypes, setWasteTypes] = useState([]);

  const handleExpiryDateChange = (text) => {
    let formatted = text.replace(/[^0-9]/g, "");
    if (formatted.length > 0) {
      const month = parseInt(formatted.slice(0, 2));
      const year = parseInt(formatted.slice(2, 4));
      const currentYear = new Date().getFullYear() % 100;

      if (month > 12) {
        formatted = "12" + formatted.slice(2);
      }
      if (year < currentYear && formatted.length === 4) {
        formatted = formatted.slice(0, 2) + currentYear.toString();
      }
    }
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
    }
    setCardExpiry(formatted);
  };

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

  const fetchBinTypes = async () => {
    if (!userID) return;

    setLoading(true);
    try {
      const binTypesData = await getBinTypes();
      setBinTypes(binTypesData);
    } catch (error) {
      console.error("Error fetching binTypes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBinTypes();
    }, [])
  );

  console.log(binTypes);

  const handleBinTypeChange = (type) => {
    setBinType(type.binType);
    setAvailableCapacities(Object.keys(type.binSizes));
    setCapacity(""); // Reset capacity on bin type change
    setPrice(0); // Reset price
    setCharging(type.chargingPerKg);
    setIncentives(type.incentivesPerKg);
    setRecyclable(type.recyclable);
    setWasteTypes(type.wasteTypes);
    setShowTypeModal(false);
  };

  const handleCapacityChange = (cap) => {
    setCapacity(cap);
    setPrice(
      binTypes.find((bin) => bin.binType === binType).binSizes[
        cap.toLowerCase()
      ]
    );
    setShowCapacityModal(false);
  };

  const handlePayNow = () => {
    setShowCardModal(true);
  };

  const handleCardSubmit = () => {
    if (cardNumber && cardExpiry && cardCVV) {
      setShowCardModal(false);
      Alert.alert("Purchase Successful", "Your bin has been purchased.");
      generatePDF();
    } else {
      Alert.alert("Error", "Please fill in all card details");
    }
  };

  const generatePDF = () => {
    console.log("Generating PDF for:");
    console.log(`Bin Type: ${binType}`);
    console.log(`Capacity: ${capacity}`);
    console.log(`Price: $${price}`);
    Alert.alert("PDF Generated", "Your receipt has been generated and saved.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Purchase a Bin</Text>

        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={styles.label}>Bin Type</Text>
          <Text style={styles.pickerText}>{binType || "Select Bin Type"}</Text>
          <Ionicons name="chevron-down" size={24} color="#4CAF50" />
        </TouchableOpacity>

        {binType && (
          <>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowCapacityModal(true)}
            >
              <Text style={styles.label}>Capacity</Text>
              <Text style={styles.pickerText}>
                {capacity || "Select Capacity"}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#4CAF50" />
            </TouchableOpacity>

            {wasteTypes.length > 0 && (
              <View style={styles.wasteTypesContainer}>
                <Text style={styles.wasteTypesTitle}>
                  Accepted Waste Types:
                </Text>
                {wasteTypes.map((waste, index) => (
                  <Text key={index} style={styles.wasteTypeText}>
                    {waste}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.price}>
                LKR {parseFloat(price).toFixed(2)}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Charging per Kg:</Text>
              <Text style={styles.price}>
                LKR {parseFloat(charging).toFixed(2)}
              </Text>
            </View>

            {recyclable && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Incentives per Kg:</Text>
                <Text style={styles.price}>
                  LKR {parseFloat(incentives).toFixed(2)}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Ionicons
                name="card-outline"
                size={24}
                color="#FFFFFF"
                style={styles.payIcon}
              />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </>
        )}

        <Modal visible={showTypeModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Bin Type</Text>
              {binTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.modalItem}
                  onPress={() => handleBinTypeChange(type)}
                >
                  <Text style={styles.modalItemText}>{type.binType}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTypeModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCapacityModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Capacity</Text>
              {availableCapacities.map((cap) => (
                <TouchableOpacity
                  key={cap}
                  style={styles.modalItem}
                  onPress={() => handleCapacityChange(cap)}
                >
                  <Text style={styles.modalItemText}>{cap}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCapacityModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showCardModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Card Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                placeholderTextColor="#A9A9A9"
                maxLength={16}
              />
              <TextInput
                style={styles.input}
                placeholder="Expiry Date (MM/YY)"
                value={cardExpiry}
                onChangeText={handleExpiryDateChange}
                keyboardType="number-pad"
                placeholderTextColor="#A9A9A9"
                maxLength={5}
              />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                value={cardCVV}
                onChangeText={setCardCVV}
                keyboardType="number-pad"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
                maxLength={3}
              />
              <TouchableOpacity
                style={styles.modalPayButton}
                onPress={handleCardSubmit}
              >
                <Text style={styles.modalPayButtonText}>
                  Pay LKR {parseFloat(price).toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCardModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  pickerText: {
    fontSize: 16,
    color: "#333333",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  price: {
    fontSize: 16,
    color: "#4CAF50",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  payIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333333",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    marginBottom: 20,
    paddingVertical: 5,
    fontSize: 16,
  },
  modalPayButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  modalPayButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  wasteTypesContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  wasteTypesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  wasteTypeText: {
    fontSize: 14,
    color: "#333333",
    marginVertical: 2,
  },
});

export default BinPurchasePage;
