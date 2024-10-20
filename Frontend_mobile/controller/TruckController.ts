import { db } from "../storage/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const getTrucksForCollector = async (collectorId: string) => {
    try {
        console.log(collectorId);
      const trucksCollection = collection(db, "trucks");
      const trucksSnapshot = await getDocs(trucksCollection);
      const assignedTrucks = trucksSnapshot.docs.filter((doc) =>
        doc.data().employees.includes(collectorId)
      );
      return assignedTrucks.map((truckDoc) => ({
        id: truckDoc.id,
        ...truckDoc.data(),
      }));
    } catch (error) {
      console.error("Error fetching trucks for collector:", error);
      throw error;
    }
  };
  
  
export const getLocationById = async (id) => {
    try {
      const locationRef = doc(db, "locations", id);
      const locationDoc = await getDoc(locationRef);
  
      if (locationDoc.exists()) {
        const locationData = {
          id: locationDoc.id,
          ...locationDoc.data(),
        };
        console.log("Location retrieved successfully:", locationData);
        return locationData;
      } else {
        console.log("No such document!");
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error retrieving location:", error);
      throw new Error("Failed to fetch location by ID");
    }
  };



// Function to fetch location details by an array of IDs
export const getLocationsByIds = async (locationIds: string[]) => {
  try {
    // Use Promise.all to fetch all locations in parallel
    const locationPromises = locationIds.map(async (id) => {
      const locationRef = doc(db, 'locations', id);
      const locationDoc = await getDoc(locationRef);

      if (locationDoc.exists()) {
        return {
          id: locationDoc.id,
          ...locationDoc.data(),
        };
      } else {
        console.log(`Location with ID ${id} not found.`);
        return null; // If a location does not exist, return null
      }
    });

    // Wait for all location promises to resolve
    const locationDataArray = await Promise.all(locationPromises);

    // Filter out any null values (i.e., locations that were not found)
    const validLocations = locationDataArray.filter((location) => location !== null);

    console.log('Locations retrieved successfully:', validLocations);
    return validLocations;
  } catch (error) {
    console.error('Error retrieving locations:', error);
    throw new Error('Failed to fetch locations');
  }
};
