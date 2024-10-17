import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCollectorDetails } from "../controller/collectorController";
import { useNavigation } from "@react-navigation/native";

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCollectorDetails();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

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
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Loading user details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5.png",
            }}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.infoContainer}>
          <InfoCard
            icon="person-circle-outline"
            label="Name"
            value={user.name}
            bgColor="grey"
          />
        </View>

        <View style={styles.infoContainer}>
          <InfoCard
            icon="mail-outline"
            label="User Name"
            value={user.email}
            bgColor="#03A9F4"
          />
        </View>
        <View style={styles.infoContainer}>
          <InfoCard
            icon="mail-outline"
            label="Driving Liscenscn No"
            value={user.drivingLicense
            }
            bgColor="#03A9F4"
          />
        </View>
        <View style={styles.infoContainer}>
          <InfoCard
            icon="location-outline"
            label="User Name"
            value={user.address}
            bgColor="#03A9F4"
          />
        </View>

        <View style={styles.infoContainer}>
          <InfoCard
            icon="call-outline"
            label="Phone"
            value={user.phone}
            bgColor="#03A9F4"
          />
        </View>

        <View style={styles.infoContainer}>
          <InfoCard
            icon="location-outline"
            label="Address"
            value={user.address}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserDetailsPage;
