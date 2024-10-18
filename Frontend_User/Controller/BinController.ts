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
