import { collection, query, where, getDocs,updateDoc,doc } from "firebase/firestore";
import { db } from "../storage/firebase";

// Function to find a bin by binID
export const findBinByID = async (binID) => {
  try {
    
    // Query the "bins" collection where "binID" matches the provided binID
    const binCollection = collection(db, "bins");
    const binQuery = query(binCollection, where("binID", "==", binID));

    // Execute the query
    const binSnapshot = await getDocs(binQuery);

    // Check if any bins match the provided binID
    if (!binSnapshot.empty) {
      // Assuming binID is unique, return the first matching bin
      const binDoc = binSnapshot.docs[0];
      const binData = {
        id: binDoc.id,  // Firebase document ID
        ...binDoc.data(),  // Bin data
      };
      return binData; // Return the bin data
    } else {
      // If no bin is found with the provided binID, return null
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving bin with binID ${binID}:`, error);
    throw new Error("Failed to fetch bin by binID");
  }
};

export const resetBinWasteLevel = async (binId) => {
  try {
    console.log(binId);
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