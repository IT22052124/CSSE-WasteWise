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
import { db } from "../storage/firebase";

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

export const createBinRequest = async (binType, binTypeId, userId, capacity) => {
  try {

    const userRef = doc(db, "users", userId);
    const binRef = doc(db, "binTypes", binTypeId);
    // Create a new bin request object
    const newBinRequest = {
      binType: binType,
      binTypeId: binRef,
      userId: userRef,
      capacity: capacity,
      status: "Pending", // Set status to 'Pending'
      createdAt: new Date(), // Optionally store the timestamp when the request was created
    };

    // Reference to the 'binRequests' collection
    const binRequestsCollection = collection(db, "binRequests");

    // Add a new document with an auto-generated ID
    const docRef = await addDoc(binRequestsCollection, newBinRequest);

    console.log("Bin request created successfully with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating bin request: ", error);
  }
};
