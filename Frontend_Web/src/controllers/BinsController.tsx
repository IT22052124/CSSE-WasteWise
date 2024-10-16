import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit

} from "firebase/firestore";
import { db } from "@/storage/firebase";

// Function to add a new bin
export const addBin = async (binData) => {
  try {
    const docRef = await addDoc(collection(db, "bins"), {
      ...binData,
      wasteLevel: 0, // Set initial waste level to 0
      createdAt: serverTimestamp(),
    });

    // Navigate to the bins list page
    return docRef;
  } catch (e) {
    console.error("Error adding bin:", e);
    throw e;
  }
};

// Function to retrieve all bins
export const getBins = async () => {
  try {
    const binCollection = collection(db, "bins");
    const binSnapshot = await getDocs(binCollection);
    const bins = binSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Bins retrieved successfully:", bins);
    return bins;
  } catch (error) {
    console.error("Error retrieving bins:", error);
    throw new Error("Failed to fetch bins");
  }
};

// Function to reset bin waste level to 0 after collection
export const resetBinWasteLevel = async (binId) => {
  try {
    const binDocRef = doc(db, "bins", binId);
    await updateDoc(binDocRef, {
      wasteLevel: 0, // Reset waste level to 0
    });
    console.log(`Waste level for bin ${binId} has been reset to 0`);
  } catch (error) {
    console.error(`Error resetting waste level for bin ${binId}:`, error);
    throw new Error("Failed to reset waste level");
  }
};

//function to get last BinID
export const getLastBinID = async () => {
    try {
      // Query the "bins" collection, order by "binID" in descending order, and limit the result to 1
      const binCollection = collection(db, "bins");
      const lastBinQuery = query(binCollection, orderBy("binID", "desc"), limit(1));
  
      // Execute the query
      const binSnapshot = await getDocs(lastBinQuery);
  
      // Check if we have any bins in the collection
      if (!binSnapshot.empty) {
        // Get the binID of the last bin
        const lastBin = binSnapshot.docs[0].data();
        return lastBin.binID; // Return the binID (e.g., "B004")
      } else {
        // If there are no bins in the collection, return null
        return null;
      }
    } catch (error) {
      console.error("Error retrieving last binID:", error);
      throw new Error("Failed to fetch last binID");
    }
  };