import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../storage/firebase'; 

interface BinTypeData {
  name: string;
  color: string;
}

export const createBinType = async (formData: BinTypeData) => {
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
