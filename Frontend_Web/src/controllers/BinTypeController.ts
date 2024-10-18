import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/storage/firebase";

export const getAllWasteTypes = async () => {
  try {
    // Step 1: Reference the wasteTypes collection
    const wasteTypesRef = collection(db, "wasteTypes");

    // Step 2: Execute the query to get all documents
    const querySnapshot = await getDocs(wasteTypesRef);

    // Step 3: Process the results into an array of waste types
    const wasteTypes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    console.log("Waste types retrieved:", wasteTypes);

    // Return the retrieved waste types
    return wasteTypes;
  } catch (error) {
    console.error("Error retrieving waste types:", error);
    throw new Error("Failed to retrieve waste types");
  }
};

export const createBinType = async (formData) => {
  try {
    // Step 1: Reference the binTypes collection
    const binTypesRef = collection(db, "binTypes");

    // Step 2: Add a new document using the formData
    const docRef = await addDoc(binTypesRef, {
      ...formData,
      createdAt: serverTimestamp(),
    });

    console.log("Bin type created with ID:", docRef.id);

    // Return the document ID of the newly created bin type
    return docRef.id;
  } catch (error) {
    console.error("Error creating bin type:", error);
    throw new Error("Failed to create bin type");
  }
};

export const getBinTypes = async () => {
  try {
    // Step 1: Reference the binTypes collection
    const binTypesRef = collection(db, "binTypes");

    // Step 2: Get documents from the collection
    const querySnapshot = await getDocs(binTypesRef);

    // Step 3: Process the results into an array of bin types
    const binTypes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    console.log("Bin types retrieved:", binTypes);

    // Return the retrieved bin types
    return binTypes;
  } catch (error) {
    console.error("Error retrieving bin types:", error);
    throw new Error("Failed to retrieve bin types");
  }
};

export const deleteBinType = async (id) => {
  const binTypeRef = doc(db, "binTypes", id); // "binTypes" is your Firestore collection name
  await deleteDoc(binTypeRef); // Delete the document
};

export const getBinTypeById = async (id) => {
  try {
    const docRef = doc(db, "binTypes", id); // Reference to the specific bin type

    const docSnap = await getDoc(docRef); // Fetch the document
    if (docSnap.exists()) {
      return docSnap.data(); // Return the bin type data if found
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting bin type by ID:", error);
    throw error;
  }
};

export const updateBinType = async (id, updatedData) => {
  try {
    const docRef = doc(db, "binTypes", id); // Reference to the specific bin type
    await updateDoc(docRef, updatedData); // Update the bin type with new data
    console.log("Bin type updated successfully!");
  } catch (error) {
    console.error("Error updating bin type:", error);
    throw error;
  }
};
