import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/storage/firebase";

// Add new collection model
export const addCollectionModel = async (collectionModelData) => {
  try {
    const docRef = await addDoc(collection(db, "collectionModels"), {
      ...collectionModelData,
      locations: [],
      createdAt: serverTimestamp(),
    });
    console.log("Collection Model added with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding collection model: ", e);
    throw e;
  }
};

// Get all collection models
export const getCollectionModels = async () => {
  try {
    const collectionModelCollection = collection(db, "collectionModels");
    const collectionModelSnapshot = await getDocs(collectionModelCollection);

    const collectionModels: CollectionModel[] = await Promise.all(
      collectionModelSnapshot.docs.map(async (docSnapshot) => {
        const collectionModelData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as CollectionModel;

        if (
          collectionModelData.locations &&
          collectionModelData.locations.length > 0
        ) {
          collectionModelData.locations = await Promise.all(
            collectionModelData.locations.map(async (locationId) => {
              const locationRef = doc(db, "locations", locationId);
              const locationDoc = await getDoc(locationRef);
              return locationDoc.exists()
                ? ({ id: locationDoc.id, ...locationDoc.data() } as Location)
                : null;
            })
          );
        }

        return collectionModelData;
      })
    );

    console.log("Collection models retrieved successfully:", collectionModels);
    return collectionModels;
  } catch (error) {
    console.error("Error retrieving collection models:", error);
    throw new Error("Failed to fetch collection models");
  }
};

// Update a collection model by ID
export const updateCollectionModel = async (id, updatedCollectionModelData) => {
  try {
    const collectionModelRef = doc(db, "collectionModels", id);
    await updateDoc(collectionModelRef, {
      ...updatedCollectionModelData,
      updatedAt: serverTimestamp(),
    });
    console.log("Collection model updated with ID: ", id);
  } catch (e) {
    console.error("Error updating collection model: ", e);
    throw e;
  }
};

// Delete a collection model by ID
export const deleteCollectionModel = async (id) => {
  try {
    const collectionModelRef = doc(db, "collectionModels", id);
    await deleteDoc(collectionModelRef);
    console.log("Collection model deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting collection model: ", e);
    throw e;
  }
};

// Get a collection model by ID
export const getCollectionModelById = async (id) => {
  try {
    const collectionModelRef = doc(db, "collectionModels", id);
    const collectionModelDoc = await getDoc(collectionModelRef);

    if (collectionModelDoc.exists()) {
      const collectionModelData = {
        id: collectionModelDoc.id,
        ...collectionModelDoc.data(),
      };
      console.log(
        "Collection model retrieved successfully:",
        collectionModelData
      );
      return collectionModelData;
    } else {
      console.log("No such document!");
      throw new Error("Collection model not found");
    }
  } catch (error) {
    console.error("Error retrieving collection model:", error);
    throw new Error("Failed to fetch collection model by ID");
  }
};
