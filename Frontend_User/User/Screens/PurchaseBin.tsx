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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserDetails } from "../../Controller/UserController";
import { getBinTypes, createBinRequest } from "../../Controller/BinController";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const BinPurchasePage = () => {
  const [binType, setBinType] = useState("");
  const [binTypeId, setBinTypeId] = useState("");
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
  const navigation = useNavigation();

  const generateRefNumber = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let refNumber = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      refNumber += characters[randomIndex];
    }
    return refNumber;
  };

  const generatePDF = async () => {
    try {
      const userDetails = await getUserDetails();
      const referenceNumber = generateRefNumber(8);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WasteWise Bin Purchase Receipt</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
                
                body {
                    font-family: 'Roboto', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }
                .content {
                    padding: 30px;
                }
                .details {
                    background-color: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .details p {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    font-size: 14px;
                }
                .details strong {
                    color: #4CAF50;
                }
                .thank-you {
                    text-align: center;
                    font-size: 18px;
                    color: #4CAF50;
                    margin-top: 20px;
                    font-weight: 700;
                }
                .footer {
                    background-color: #f0f0f0;
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #666;
                }
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 100px;
                    color: rgba(76, 175, 80, 0.05);
                    pointer-events: none;
                    z-index: 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>WasteWise Bin Purchase Receipt</h1>
                </div>
                <div class="content">
                    <div class="watermark">RECEIPT</div>
                    <div class="details">
                        <p><strong>Reference Number:</strong> <span>${referenceNumber}</span></p>
                        <p><strong>Date:</strong> <span>${formattedDate}</span></p>
                        <p><strong>Time:</strong> <span>${formattedTime}</span></p>
                        <p><strong>User Email:</strong> <span>${
                          userDetails.email
                        }</span></p>
                        <p><strong>Bin Type:</strong> <span>${binType}</span></p>
                        <p><strong>Capacity:</strong> <span>${capacity}</span></p>
                        <p><strong>Amount:</strong> <span>LKR ${parseFloat(
                          price
                        ).toFixed(2)}</span></p>
                        <p><strong>Payment Status:</strong> <span>Success</span></p>
                    </div>
                    <div class="thank-you">
                        Thank you for your purchase!
                    </div>
                </div>
                <div class="footer">
                    This is an official receipt. No signature is required.
                </div>
            </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on your device");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate receipt");
    }
  };

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserAndBinTypes = async () => {
        try {
          const userData = await getUserDetails();
          setUserID(userData.id);
          const binTypesData = await getBinTypes();
          setBinTypes(binTypesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchUserAndBinTypes();
    }, [])
  );

  const handleBinTypeChange = (type) => {
    setBinType(type.binType);
    setBinTypeId(type.id);
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
    if (!binType || !capacity) {
      Toast.show({
        type: "error",
        text1: "Please Select Bin Capacity",
      });
      return;
    }
    setShowCardModal(true);
  };

  const handleCardSubmit = async () => {
    setIsLoading(true);
    if (cardNumber && cardExpiry && cardCVV) {
      if (!binType || !binTypeId || !userID || !capacity) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      try {
        await createBinRequest(binType, binTypeId, userID, capacity);
        Toast.show({
          type: "success",
          text1: "Bin requested successfully",
        });

        await generatePDF();
        // Reset the form or perform additional actions
        setBinType("");
        setBinTypeId("");
        setCapacity("");
        setCardCVV("");
        setCardExpiry("");
        setCardNumber("");
        setIsLoading(false);
        setShowCardModal(false);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Failed to send bin request",
        });
        console.error(error);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Please fill in all card details",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchase a Bin</Text>
      </View>
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalPayButtonText}>
                    Pay LKR {parseFloat(price).toFixed(2)}
                  </Text>
                )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  generatePdfButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  generatePdfButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  pdfIcon: {
    marginRight: 10,
  },
});

export default BinPurchasePage;
