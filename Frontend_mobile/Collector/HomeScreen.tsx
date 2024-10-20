import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Animated, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getTrucksForCollector, getLocationsByIds } from '../controller/TruckController';
import { getCollectorDetails } from "../controller/collectorController";
import moment from 'moment'; // For formatting the current date

type Truck = {
  id: string;
  truckId: string;
  numberPlate: string;
  vehicleType: string;
  Driver: {
    Drivername: string;
    DriverPhone: string;
  };
  locations: string[];
  locationDetails?: any[];
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const [collectorId, setUser] = useState(null);
  const [ID, setID] = useState(null);

  const [collectorName, setCollectorName] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<string>(moment().format('MMMM Do YYYY, dddd')); // Get today's date

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCollectorDetails();
        setUser(userData.id);
        setID(userData.collectorID);
        setCollectorName(userData.name); // Assuming you have collector's name in userData
      } catch (error) {
        console.error("Failed to fetch user details: ", error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const truckData = await getTrucksForCollector(collectorId);
        const updatedTrucks = await Promise.all(truckData.map(async (truck) => {
          const locationDetails = await getLocationsByIds(truck.locations);
          return { ...truck, locationDetails };
        }));
        setTrucks(updatedTrucks);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (collectorId) {
      fetchTrucks();
    }
  }, [collectorId]);

  const renderItem = ({ item }: { item: Truck }) => {
    return (
      <Animated.View style={styles.truckItem}>
        <View style={styles.truckHeader}>
          <MaterialIcons name="local-shipping" size={30} color="#FFFFFF" />
          <Text style={styles.truckId}>Truck ID: {item.truckId}</Text>
        </View>
        <View style={styles.truckInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="credit-card" size={24} color="#34495E" />
            <Text style={styles.infoText}>Number Plate: {item.numberPlate}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={24} color="#34495E" />
            <Text style={styles.infoText}>Vehicle Type: {item.vehicleType}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={24} color="#34495E" />
            <Text style={styles.infoText}>Driver: {item.Driver.Drivername}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#34495E" />
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.Driver.DriverPhone}`)}>
              <Text style={styles.infoText}>Phone: {item.Driver.DriverPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.locationsContainer}>
          <Text style={styles.locationsHeader}>Assigned Locations:</Text>
          {item.locationDetails && item.locationDetails.length > 0 ? (
            item.locationDetails.map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <MaterialIcons name="location-on" size={18} color="#3498DB" />
                <Text style={styles.locationText}>{location.locationName}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noLocationsText}>No locations assigned</Text>
          )}
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${item.Driver.DriverPhone}`)}>
            <FontAwesome5 name="phone-alt" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call Driver</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="assignment" size={30} color="#FFFFFF" />
        <Text style={styles.title}>Assigned Trucks</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Collector: {collectorName}</Text>
        <Text style={styles.userId}>Collector ID: {ID}</Text>
      </View>
      <View style={styles.truckListHeader}>
        <Text style={styles.truckListTitle}>Truck Assignments</Text>
      </View>
      
      {trucks.length === 0 ? ( // Check if there are no trucks
        <View style={styles.noAssignmentContainer}>
          <Text style={styles.noAssignmentText}>No assignment today</Text>
        </View>
      ) : (
        <AnimatedFlatList
          data={trucks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#3498DB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 18,
    color: '#7F8C8D',
  },
  userInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  userId: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
  },
  truckListHeader: {
    padding: 15,
    backgroundColor: '#3498DB',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  truckListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  truckItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  truckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2980B9',
  },
  truckId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  truckInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#BDC3C7',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#34495E',
  },
  locationsContainer: {
    padding: 20,
  },
  locationsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3498DB',
  },
  noLocationsText: {
    fontStyle: 'italic',
    color: '#BDC3C7',
  },
  actionsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAssignmentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noAssignmentText: {
    fontSize: 18,
    color: '#7F8C8D',
  },
});
