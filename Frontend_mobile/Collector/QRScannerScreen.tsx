import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import { RootStackParamList } from '../App'; 
import { findBinByID } from "../controller/BinController"; 
import Toast from 'react-native-toast-message';

// Ignore specific warning messages
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

type QRScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

//function 
export default function QRScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); 
  const navigation = useNavigation<QRScannerScreenNavigationProp>();

  useEffect(() => {
    if (permission?.granted === false) {
      Alert.alert('Permission required', 'We need your permission to show the camera');
    }
  }, [permission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return; // Prevent multiple scans
    setScanned(true);
    try {
      console.log('Scanned data:', data); // Log the scanned data
      const binData = await findBinByID(data);
      
      if (!binData) {
        // Handle case where binData is null or undefined
        Toast.show({
          type: 'error',
          text1: 'No Bin Found',
          text2: 'The scanned bin ID does not match any records.',
          visibilityTime: 3000, // Show for 3 seconds
        });
        setScanned(false); // Allow scanning again
        return; // Exit the function
      }
      // Toast to show
      Toast.show({
        type: 'success',
        text1: 'Scan Successful',
        text2: 'Bin data retrieved successfully.',
        visibilityTime: 3000, // Show for 3 seconds
      });
      navigation.navigate('BinData', { binData }); // navigation to BinData Screen
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bin data. Please try again.');
      console.error(error);
      setScanned(false); // Allow scanning again
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Loading camera permissions...</Text></View>;
  }
   //return when function permission is not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // Updated prop name
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // Specify the types of barcodes to scan
        }}
      />
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

//styles for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2C3E50', // Darker background for better contrast
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#ECF0F1', // Lighter text color
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: '#3498DB', // Green background for scan again button
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Shadow effect
  },
  scanAgainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
