import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // This is a placeholder for the actual user data
  const userData = {
    name: 'John Doe',
    id: '12345',
    email: 'john.doe@example.com',
    role: 'Waste Collector',
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text>Name: {userData.name}</Text>
      <Text>ID: {userData.id}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Role: {userData.role}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});