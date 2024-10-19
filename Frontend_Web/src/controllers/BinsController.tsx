import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  setDoc,
  getDoc,
  where

} from "firebase/firestore";
import { db } from "@/storage/firebase";



// Function to add a new bin to Firestore
export const addBin = async (binData) => {
  try {
    // Get userRef and wasteTypeRef as actual document references
    const userRef = doc(db, "users", binData.userRef); // Reference to the user document
    const wasteTypeRef = doc(db, "binTypes", binData.wasteTypeRef); // Reference to the waste type document

    // Create a bin document in Firestore
    const docRef = await addDoc(collection(db, "bins"), {
      ...binData,
      userRef, // Store the user document reference
      wasteTypeRef, // Store the waste type document reference
      wasteLevel: 0, // Set initial waste level to 0
      createdAt: serverTimestamp(), // Add timestamp
    });

    console.log("Bin successfully added:", docRef.id);
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
      const lastBinQuery = query(binCollection, orderBy("binID", "desc"));
       
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

  export const updateBinWasteLevel = async (documentId: string, newWasteLevel: number) => {
    if (!documentId) {
      console.error("Invalid document ID");
      return;
    }
  
    const binRef = doc(db, "bins", documentId);
    try {
      await updateDoc(binRef, { wasteLevel: newWasteLevel });
      console.log(`Waste level updated for document ID ${documentId}: ${newWasteLevel}`);
    } catch (error) {
      console.error("Error updating waste level:", error);
    }
  };

  // Function to simulate waste level updates for all bins at a set interval
 // Function to simulate waste level updates for all bins at a set interval
export const autoUpdateWasteLevels = async (intervalInMs = 10000000) => { // 10 seconds
  try {
    setInterval(async () => {
      // Get all bins
      const bins = await getBins();

      // Iterate over each bin to update the waste level
      bins.forEach(async (bin) => {
        // Generate a random increment for this bin
        const increment = Math.random() * 2; // Random increment between 0 and 2 (adjust as needed)
        const newWasteLevel = Math.min(bin.wasteLevel + increment, 100); // Cap at 100%

        // Update waste level for this bin in the database
        await updateBinWasteLevel(bin.id, newWasteLevel);
        console.log(`Updated bin ${bin.id} to waste level ${newWasteLevel.toFixed(2)}%`);
      });
    }, intervalInMs); // Runs every 10 seconds
  } catch (error) {
    console.error("Error during auto waste level update:", error);
  }
};
export const getBinRequests = async () => {
  try {
    const binRequestsCollection = collection(db, "binRequests");
    const q = query(binRequestsCollection, where("status", "==", "Pending"));
    const binRequestsSnapshot = await getDocs(q);
    const binRequests = binRequestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return binRequests;
  } catch (error) {
    console.error("Error fetching pending bin requests:", error);
    throw error;
  }
};


// Function to update the bin request status based on RequestID
export const updateBinRequestStatusByRequestID = async (requestID: string) => {
  try {
    // Reference to the binRequests collection
    const binRequestsCollection = collection(db, "binRequests");
    
    // Create a query to find the bin request by RequestID
    const q = query(binRequestsCollection, where("ReqID", "==", requestID));
    const binRequestsSnapshot = await getDocs(q);

    if (!binRequestsSnapshot.empty) {
      // Assuming there should only be one request with a unique RequestID
      const binRequestDoc = binRequestsSnapshot.docs[0]; // Get the first matching document

      // Get the reference to the specific bin request document
      const binRequestRef = doc(db, "binRequests", binRequestDoc.id);

      // Update the status field to "success"
      await updateDoc(binRequestRef, {
        status: "success",
      });

      console.log(`Bin request with RequestID ${requestID} status updated to success`);
    } else {
      console.log(`No bin requests found with RequestID: ${requestID}`);
    }
  } catch (error) {
    console.error("Error updating bin request status:", error);
    throw error;
  }
};



export const getDocData = async (docRef) => {
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};