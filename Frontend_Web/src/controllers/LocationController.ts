import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/storage/firebase";
import { updateCollectionModel } from "./CollectionModelController";


export const addLocation = async (locationData) => { // Add a new location
  try {
    // Add the new location
    const docRef = await addDoc(collection(db, "locations"), {
      ...locationData,
      createdAt: serverTimestamp(),
    });

    // Fetch the current collection model
    const collectionModelRef = doc(
      db,
      "collectionModels",
      locationData.collectionModel
    );
    const collectionModelDoc = await getDoc(collectionModelRef);

    if (collectionModelDoc.exists()) {
      const currentModelData = {
        id: collectionModelDoc.id,
        ...collectionModelDoc.data(),
      };

      // Update the collection model to include the new location ID
      await updateCollectionModel(currentModelData.id, {
        locations: [...currentModelData.locations, docRef.id],
      });
    } else {
      console.log("No such collection model found!");
    }

    console.log("Location added with ID: ", docRef.id);
    return docRef.id; // Return the ID of the added location
  } catch (e) {
    console.error("Error adding location: ", e);
    throw e;
  }
};

export const getLocations = async () => { // Fetch all locations
  try {
    const locationsCollection = collection(db, "locations");
    const locationsSnapshot = await getDocs(locationsCollection);
    const locations: Location[] = await Promise.all(
      locationsSnapshot.docs.map(async (docSnapshot) => {
        const locationData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as Location;

        if (locationData.collectionModel) {
          const collectionModelRef = doc(
            db,
            "collectionModels",
            locationData.collectionModel
          );
          const collectionModelSnapshot = await getDoc(collectionModelRef);

          // Check if the collection model document exists and set its data
          locationData.collectionModel = collectionModelSnapshot.exists()
            ? {
                id: collectionModelSnapshot.id,
                ...collectionModelSnapshot.data(), // Ensure this is properly typed
              }
            : null;
        }

        return locationData;
      })
    );

    console.log("Locations retrieved successfully:", locations);
    return locations;
  } catch (error) {
    console.error("Error retrieving locations:", error);
    throw new Error("Failed to fetch locations");
  }
};

export const getLocationById = async (id) => { // Fetch a location by ID
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

export const updateLocation = async (id, updatedLocationData) => { // Update a location by ID
  try {
    const locationRef = doc(db, "locations", id);
    await updateDoc(locationRef, {
      ...updatedLocationData,
      updatedAt: serverTimestamp(),
    });
    console.log("Location updated with ID: ", id);
  } catch (e) {
    console.error("Error updating location: ", e);
    throw e;
  }
};

export const deleteLocation = async (id) => {
  try {
    const locationRef = doc(db, "locations", id);
    await deleteDoc(locationRef);
    console.log("Location deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting location: ", e);
    throw e;
  }
};
