import { collection, query, where, getDocs } from "firebase/firestore";
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
      console.log(`Bin with binID ${binID} found:`, binData);
      return binData; // Return the bin data
    } else {
      // If no bin is found with the provided binID, return null
      console.log(`No bin found with binID: ${binID}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving bin with binID ${binID}:`, error);
    throw new Error("Failed to fetch bin by binID");
  }
};