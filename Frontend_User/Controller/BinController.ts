import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where
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



export const findBinsByUserEmail = async (email: string) => {
  try {
    // Reference the 'bins' collection in Firestore
    const binsRef = collection(db, "bins");

    // Create a query that looks for bins where the 'user.email' field matches the provided email
    const q = query(binsRef, where("user.email", "==", email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If no bins are found, return an empty array
    if (querySnapshot.empty) {
      console.log("No bins found for this user.");
      return [];
    }

    // Extract and return bin data
    const bins = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bins;

  } catch (error) {
    console.error("Error finding bins by user email:", error);
    throw new Error("Unable to find bins for the user.");
  }
};

