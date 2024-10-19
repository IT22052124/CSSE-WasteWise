import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; 
import { findBinByID } from "../controller/BinController"; 

type QRScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

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
      console.log(binData);
      navigation.navigate('BinData', { binData });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bin data. Please try again.');
      console.error(error);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Loading camera permissions...</Text></View>;
  }

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
          <Text style={styles.scanAgainText}>Tap to Scan </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
    backgroundColor: '#2ecc71', // Blue background for scan again button
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
