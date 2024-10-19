import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { findBinsByUserEmail } from "../../Controller/BinController";
import { getUserDetails } from "../../Controller/UserController";
import { Trash2, AlertTriangle, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type BinItem = {
  id: string;
  binType: string;
  customBinColor: string;
  wasteLevel: number;
  price: number;
  imageUrl: string;
  binID: string;
  type: {
    wasteType: string;
  };
};

const binImages = [
  require("../../assets/bin1.jpg"),
  require("../../assets/bin2.jpg"),
  require("../../assets/bin3.png"),
  require("../../assets/bin4.jpeg"),
];

export default function YourBinsScreen() {
  const [bins, setBins] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUserDetails();
        if (userData && userData.email) {
          setUserEmail(userData.email);
        }
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchBins = async (email: string) => {
      try {
        setLoading(true);
        const binData = await findBinsByUserEmail(email);
        setBins(binData);
        console.log("bro--------",binData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch bins: ", error);
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchBins(userEmail); // Initial fetch

      const intervalId = setInterval(() => {
        fetchBins(userEmail); // Fetch bins every 10 seconds
      }, 100000000); // 10000 ms = 10 seconds

      // Clear the interval on component unmount or userEmail change
      return () => clearInterval(intervalId);
    }
  }, [userEmail]);

  const navigateToBinScreen = () => {
    navigation.navigate("BinPurchasePage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bins</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {bins.length > 0 ? (
          bins.map((item, index) => (
            <TouchableOpacity key={item.id} style={styles.binItem}>
              <View
                style={[
                  styles.binColorIndicator,
                  { backgroundColor: item.customBinColor },
                ]}
              />
              <View style={styles.binContent}>
                <View style={styles.binImageContainer}>
                  <Image
                    source={binImages[index % binImages.length]}
                    style={styles.binImage}
                  />
                  <Text style={styles.binTypeText}>{item.binType}</Text>
                </View>
                <View style={styles.binInfo}>
                  <Text style={styles.binTitle}>
                    {item.binType} Bin : {item.binID}
                  </Text>
                  <Text style={styles.wasteTypeText}>
                    Waste Type: {item.type.binType}
                  </Text>
                  <View style={styles.wasteLevelContainer}>
                    <Text style={styles.wasteLevelText}>Waste Level:</Text>
                    <Text
                      style={[
                        styles.wasteLevelValue,
                        { color: item.wasteLevel > 70 ? "#FF4136" : "#2ecc71" },
                      ]}
                    >
                      {item.wasteLevel.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${item.wasteLevel}%`,
                            backgroundColor:
                              item.wasteLevel > 70 ? "#FF4136" : "#2ecc71",
                          },
                        ]}
                      />
                    </View>
                    {item.wasteLevel > 70 && (
                      <AlertTriangle
                        size={16}
                        color="#FF4136"
                        style={styles.alertIcon}
                      />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noBinsContainer}>
            <Trash2 size={48} color="#999" />
            <Text style={styles.noBinsText}>No bins assigned to you yet.</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity onPress={navigateToBinScreen} style={styles.addButton}>
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#4CAF50",
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    flex: 1,
  },
  binItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  binColorIndicator: {
    width: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  binContent: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  binImageContainer: {
    position: "relative",
  },
  binImage: {
    marginTop: 2,
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  binTypeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  binInfo: {
    flex: 1,
    marginLeft: 16,
  },
  binTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  wasteTypeText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  wasteLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  wasteLevelText: {
    marginTop: 2,
    fontSize: 14,
    color: "#666666",
  },
  wasteLevelValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  alertIcon: {
    marginLeft: 8,
  },
  noBinsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
  },
  noBinsText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
  },
});
