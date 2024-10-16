import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "@/storage/firebase";
  import { useNavigate } from "react-router-dom";
  
  // Function to add a new bin
  export const addBin = async (binData) => {
    const navigate = useNavigate(); // For page redirection
    try {
      const docRef = await addDoc(collection(db, "bins"), {
        ...binData,
        wasteLevel: 0, // Set initial waste level to 0
        createdAt: serverTimestamp(),
      });
      console.log("Bin added successfully with ID:", docRef.id);
      navigate("Bins"); // Navigate to the bins list page
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
  