import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/storage/firebase";

export const addWasteType = async (wasteTypeData) => {
  try {
    const docRef = await addDoc(collection(db, "wasteTypes"), {
      ...wasteTypeData,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
export const getWasteTypes = async () => {
  try {
    const wasteTypeCollection = collection(db, "wasteTypes");
    const wasteTypeSnapshot = await getDocs(wasteTypeCollection);
    const wasteTypes = wasteTypeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Waste types retrieved successfully:", wasteTypes);
    return wasteTypes;
  } catch (error) {
    console.error("Error retrieving waste types:", error);
    throw new Error("Failed to fetch waste types");
  }
};
