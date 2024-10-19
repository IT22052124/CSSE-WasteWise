import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../storage/firebase";
  
  // Function to log a waste collection
  export const addWasteCollection = async (collectionData) => {
    try {
      console.log(collectionData);
      // Create references for user, bin type, and bin
      const userRef = doc(db, "users", collectionData.userRef); // Reference to the user's document
      const binTypeRef = doc(db, "binTypes", collectionData.BinTypeRef); // Reference to the bin type document
      const binRef = doc(db, "bins", collectionData.BinRef); // Reference to the bin's document
  
      // Add waste collection data, including the references
      const docRef = await addDoc(collection(db, "wasteCollection"), {
        ...collectionData,
        userRef, // Reference to the user
        binTypeRef, // Reference to the bin type
        binRef, // Reference to the bin
        collectedAt: serverTimestamp(), // Timestamp when the waste was collected
      });
  
      console.log("Waste collection added successfully with ID:", docRef.id);
      return docRef.id; // Return the new waste collection ID
    } catch (error) {
      console.error("Error adding waste collection:", error);
      throw new Error("Failed to add waste collection");
    }
  };
  
  // Function to retrieve all waste collections
  export const getWasteCollections = async () => {
    try {
      const wasteCollectionRef = collection(db, "wasteCollection");
      const wasteSnapshot = await getDocs(wasteCollectionRef);
      const wasteCollections = wasteSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Waste collections retrieved successfully:", wasteCollections);
      return wasteCollections;
    } catch (error) {
      console.error("Error retrieving waste collections:", error);
      throw new Error("Failed to fetch waste collections");
    }
  };
  
  // Function to update a waste collection record
  export const updateWasteCollection = async (collectionId, updatedData) => {
    try {
      const wasteCollectionDocRef = doc(db, "wasteCollection", collectionId);
      await updateDoc(wasteCollectionDocRef, {
        ...updatedData, // Apply the updated fields
        updatedAt: serverTimestamp(), // Timestamp for when the record was updated
      });
  
      console.log(`Waste collection ${collectionId} updated successfully`);
    } catch (error) {
      console.error(`Error updating waste collection ${collectionId}:`, error);
      throw new Error("Failed to update waste collection");
    }
  };
  
  // Function to get the last waste collection ID
  export const getLastWasteCollectionID = async () => {
    try {
      // Query the "wasteCollection" collection, order by "collectionID" in descending order, and limit the result to 1
      const wasteCollectionRef = collection(db, "wasteCollection");
      const lastCollectionQuery = query(
        wasteCollectionRef,
        orderBy("collectionID", "desc"),
        limit(1)
      );
  
      // Execute the query
      const wasteSnapshot = await getDocs(lastCollectionQuery);
  
      // Check if we have any records in the collection
      if (!wasteSnapshot.empty) {
        // Get the collectionID of the last collection record
        const lastCollection = wasteSnapshot.docs[0].data();
        return lastCollection.collectionID; // Return the collectionID (e.g., "C004")
      } else {
        // If there are no collections, return null
        return null;
      }
    } catch (error) {
      console.error("Error retrieving last collectionID:", error);
      throw new Error("Failed to fetch last collectionID");
    }
  };
  