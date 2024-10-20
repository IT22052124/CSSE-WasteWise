import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getPaymentsByUserID } from '../../Controller/paymentController'
import { getUserDetails } from '../../Controller/UserController'
import { useFocusEffect } from '@react-navigation/native'

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSlip, setSelectedSlip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userID, setUserID] = useState(null)

  //get user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDetails()
        setUserID(userData.id)
      } catch (error) {
        console.error("Failed to fetch user details: ", error)
      }
    }

    fetchUserDetails()
  }, [])

  //get all payments of user
  const fetchPayments = async () => {
    if (!userID) return

    setLoading(true)
    try {
      const paymentsData = await getPaymentsByUserID(userID)
      console.log("Fetched payments data:", paymentsData)
      setPayments(paymentsData)
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchPayments()
    }, [userID])
  )

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentDetails}>
        <Text style={styles.amount}>LKR {item.amount.toFixed(2)}</Text>
        <Text style={styles.date}>
          {item.date.toDate().toLocaleDateString()}
        </Text>
        {item.method === "bank" ? (
          <Text style={styles.method}>Bank Deposit</Text>
        ) : (
          <Text style={styles.method}>Card Payment</Text>
        )}
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>

        {item.method === "bank" && item.slipUrl && (
          <TouchableOpacity
            style={styles.viewSlipButton}
            onPress={() => {
              setSelectedSlip(item.slipUrl)
              setModalVisible(true)
            }}
          >
            <Ionicons name="eye-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFA500"
      case "Success":
        return "#4CAF50"
      case "Rejected":
        return "#FF0000"
      default:
        return "#000000"
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
      </View>
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedSlip }}
              style={styles.slipImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentDetails: {
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  method: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  viewSlipButton: {
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '70%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  slipImage: {
    width: '100%',
    height: '100%',
  },
})

export default PaymentHistoryPage