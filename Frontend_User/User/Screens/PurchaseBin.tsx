import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const binTypes = ['Plastic', 'Metal', 'Compost'];
const capacities = ['Small', 'Medium', 'Large'];
const prices = {
  'Small': 20,
  'Medium': 30,
  'Large': 45
};

const BinPurchasePage = () => {
  const [binType, setBinType] = useState('Plastic');
  const [capacity, setCapacity] = useState('Small');
  const [price, setPrice] = useState(prices['Small']);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const updatePrice = (cap: string) => {
    setPrice(prices[cap]);
  };

  const handleBinTypeChange = (type: string) => {
    setBinType(type);
    setShowTypeModal(false);
  };

  const handleCapacityChange = (cap: string) => {
    setCapacity(cap);
    updatePrice(cap);
    setShowCapacityModal(false);
  };

  const handlePayNow = () => {
    setShowCardModal(true);
  };

  const handleCardSubmit = () => {
    if (cardNumber && cardExpiry && cardCVV) {
      setShowCardModal(false);
      Alert.alert('Purchase Successful', 'Your bin has been purchased. Generating PDF receipt...');
      generatePDF();
    } else {
      Alert.alert('Error', 'Please fill in all card details');
    }
  };

  const generatePDF = () => {
    console.log('Generating PDF for:');
    console.log(`Bin Type: ${binType}`);
    console.log(`Capacity: ${capacity}`);
    console.log(`Price: $${price}`);
    Alert.alert('PDF Generated', 'Your receipt has been generated and saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Purchase a Bin</Text>

        <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowTypeModal(true)}>
          <Text style={styles.label}>Bin Type</Text>
          <Text style={styles.pickerText}>{binType}</Text>
          <Ionicons name="chevron-down" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowCapacityModal(true)}>
          <Text style={styles.label}>Capacity</Text>
          <Text style={styles.pickerText}>{capacity}</Text>
          <Ionicons name="chevron-down" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>${price}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Ionicons name="card-outline" size={24} color="#FFFFFF" style={styles.payIcon} />
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <Modal visible={showTypeModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Bin Type</Text>
              {binTypes.map((type) => (
                <TouchableOpacity key={type} style={styles.modalItem} onPress={() => handleBinTypeChange(type)}>
                  <Text style={styles.modalItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowTypeModal(false)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showCapacityModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Capacity</Text>
              {capacities.map((cap) => (
                <TouchableOpacity key={cap} style={styles.modalItem} onPress={() => handleCapacityChange(cap)}>
                  <Text style={styles.modalItemText}>{cap}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCapacityModal(false)}>
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
              />
              <TextInput
                style={styles.input}
                placeholder="Expiry Date (MM/YY)"
                value={cardExpiry}
                onChangeText={setCardExpiry}
                keyboardType="number-pad"
                placeholderTextColor="#A9A9A9"
              />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                value={cardCVV}
                onChangeText={setCardCVV}
                keyboardType="number-pad"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
              />
              <TouchableOpacity style={styles.modalPayButton} onPress={handleCardSubmit}>
                <Text style={styles.modalPayButtonText}>Pay ${price}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCardModal(false)}>
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pickerText: {
    fontSize: 16,
    color: '#000000',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  payIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#000000',
  },
  modalPayButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalPayButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default BinPurchasePage;