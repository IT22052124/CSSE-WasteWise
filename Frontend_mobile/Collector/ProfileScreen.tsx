import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Ionicons } from "@expo/vector-icons";

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

  const InfoCard = ({ icon, label, value, bgColor }) => (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {value ? <Text style={styles.infoValue}>{value}</Text> : null}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
           source={require("../assets/welcome.png")} 
          style={styles.profileImage}
        />
      </View>

      <View style={styles.infoContainer}>
        <InfoCard
          icon="person-circle-outline"
          label="ID"
          value={userData.id}
          bgColor="grey"
        />
      </View>
      <View style={styles.infoContainer}>
        <InfoCard
          icon="location-outline"
          label="Name"
          value={userData.name}
          bgColor="#03A9F4"
        />
      </View>
      <View style={styles.infoContainer}>
        <InfoCard
          icon="mail-outline" // Changed icon to "mail-outline" for email
          label="Email"
          value={userData.email}
          bgColor="#03A9F4"
        />
      </View>
      <View style={styles.infoContainer}>
        <InfoCard
          icon="location-outline"
          label="Role"
          value={userData.role}
          bgColor="#03A9F4"
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <View style={styles.logoutButtonContent}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding :20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom:40
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginBottom: 0,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 16,
    color: "#333333",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",

  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
