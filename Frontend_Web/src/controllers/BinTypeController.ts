import { collection, getDocs } from "firebase/firestore";
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
