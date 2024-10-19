import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createPayment } from "../../Controller/paymentController";
import Toast from "react-native-toast-message";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../storage/firebase";
import { getUserDetails } from "../../Controller/UserController";
import { useNavigation } from "@react-navigation/native";

const PaymentPage = () => {
  const navigation = useNavigation();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // Added state for expiry date
  const [cvv, setCvv] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [useAsDefault, setUseAsDefault] = useState(false);
  const [bankSlip, setBankSlip] = useState(null);
  const [slipURL, setSlipURL] = useState("");
  const [userID, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const scrollViewRef = useRef(null);

  const outstandingAmount = 1050.0;
  const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year

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
    setExpiryDate(formatted);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setBankSlip(result.assets[0].uri);
    }
  };

  const deleteImage = () => {
    setBankSlip(null);
  };

  const submitPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Toast.show({
        type: "error",
        text1: "Please Enter an Amount",
      });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
        Toast.show({
          type: "error",
          text1: "Please fill in all card details.",
        });
        return;
      }

      if (!acceptTerms) {
        Toast.show({
          type: "error",
          text1: "Please accept the terms and conditions.",
        });
        return;
      }

      setIsLoading(true);

      try {
        const paymentData = await createPayment(
          paymentAmount,
          userID,
          paymentMethod,
          slipURL
        );
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Payment failed.",
        });
      }

      Toast.show({
        type: "success",
        text1: "Payment Success",
      });
      setIsLoading(false);
      resetFields();
    } else if (paymentMethod === "bank") {
      if (!bankSlip) {
        Toast.show({
          type: "error",
          text1: "Please upload the bank deposit slip.",
        });

        return;
      }

      setIsLoading(true);

      const response = await fetch(bankSlip);
      const blob = await response.blob();
      const timestamp = new Date().getTime();
      const storageRef = ref(
        storage,
        `paymentSlips/${userID},${timestamp}.png`
      );

      try {
        await uploadBytes(storageRef, blob); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        setSlipURL(downloadURL);
        if (downloadURL) {
          const paymentData = await createPayment(
            paymentAmount,
            userID,
            paymentMethod,
            downloadURL // Use downloadURL here
          );

          // Payment succeeded
          Toast.show({
            type: "success",
            text1: "Payment Success",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to get download URL.",
          });
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Payment failed.",
        });
      }

      setIsLoading(false);
      resetFields();
    } else {
      Toast.show({
        type: "error",
        text1: "Please select a payment method.",
      });
    }
  };

  const resetFields = () => {
    setPaymentAmount("");
    setPaymentMethod("");
    setCardHolder("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setBankSlip(null);
    setAcceptTerms(false);
    setUseAsDefault(false);
  };

  const renderPaymentMethodForm = () => {
    if (paymentMethod === "card") {
      return (
        <View style={styles.cardForm}>
          <Text style={styles.formLabel}>Card holder</Text>
          <TextInput
            style={styles.input}
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="Your name"
            placeholderTextColor="#888"
          />
          <Text style={styles.formLabel}>Card number</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderTextColor="#888"
            keyboardType="numeric"
            maxLength={16}
          />
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.formLabel}>Expiry</Text>
              <View style={styles.expiryContainer}>
                <TextInput
                  style={[styles.input, styles.expiryInput]}
                  value={expiryDate} // Changed to expiryDate
                  onChangeText={handleExpiryDateChange} // Changed to handleExpiryDateChange
                  placeholder="MM/YY" // Changed placeholder
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  maxLength={5} // Changed maxLength
                />
              </View>
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.formLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="***"
                placeholderTextColor="#888"
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
              />
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <Ionicons
                name={acceptTerms ? "checkbox" : "square-outline"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              Accept the Terms and Conditions
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setUseAsDefault(!useAsDefault)}
            >
              <Ionicons
                name={useAsDefault ? "checkbox" : "square-outline"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              Use as default payment method
            </Text>
          </View>
        </View>
      );
    } else if (paymentMethod === "bank") {
      return (
        <View style={styles.bankForm}>
          <Text style={styles.formLabel}>Bank Account Details</Text>
          <Text style={styles.bankInfo}>Please transfer the amount to:</Text>
          <Text style={styles.bankInfo}>Account Name: Your Company Name</Text>
          <Text style={styles.bankInfo}>Account Number: 1234567890</Text>
          <Text style={styles.bankInfo}>Bank: Example Bank</Text>
          <Text style={styles.bankInfo}>IFSC Code: EXMP0001234</Text>
          {!bankSlip && (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                Upload Bank Deposit Slip
              </Text>
            </TouchableOpacity>
          )}
          {bankSlip && (
            <View style={styles.uploadedImageContainer}>
              <Image source={{ uri: bankSlip }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setBankSlip(null)}
              >
                <Ionicons name="close-circle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
    return null;
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
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Outstanding Amount</Text>
            <Text style={styles.amount}>₹{outstandingAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="cash-outline"
              size={24}
              color="#4CAF50"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              placeholder="Enter the Amount to Pay"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.sectionTitle}>Select Payment Method:</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === "card" && styles.selectedMethod,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={paymentMethod === "card" ? "#FFFFFF" : "#4CAF50"}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === "card" && styles.selectedMethodText,
                ]}
              >
                Card Payment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === "bank" && styles.selectedMethod,
              ]}
              onPress={() => setPaymentMethod("bank")}
            >
              <Ionicons
                name="business-outline"
                size={24}
                color={paymentMethod === "bank" ? "#FFFFFF" : "#4CAF50"}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === "bank" && styles.selectedMethodText,
                ]}
              >
                Bank Deposit
              </Text>
            </TouchableOpacity>
          </View>
          {renderPaymentMethodForm()}
          {paymentMethod && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={submitPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.payButtonText}>Pay</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#000000",
    fontSize: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    width: "48%",
  },
  selectedMethod: {
    backgroundColor: "#4CAF50",
  },
  paymentMethodText: {
    marginLeft: 10,
    color: "#000000",
    fontWeight: "bold",
  },
  selectedMethodText: {
    color: "#FFFFFF",
  },
  cardForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  bankForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiryInput: {
    flex: 1,
  },
  expirySeparator: {
    fontSize: 18,
    marginHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000000",
  },
  bankInfo: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  payButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadedImageContainer: {
    position: "relative",
    marginTop: 10,
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
});

export default PaymentPage;
