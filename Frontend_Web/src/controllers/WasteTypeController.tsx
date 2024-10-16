import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/storage/firebase";

export const addWasteType = async (wasteTypeData) => {
  try {
    const docRef = await addDoc(collection(db, "wasteTypes"), {
      ...wasteTypeData,
      incentives:
        wasteTypeData.incentives === 0 ? "None" : wasteTypeData.incentives,
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

export const updateWasteType = async (id, updatedWasteTypeData) => {
  try {
    const wasteTypeRef = doc(db, "wasteTypes", id);
    await updateDoc(wasteTypeRef, {
      ...updatedWasteTypeData,
      updatedAt: serverTimestamp(),
    });
    console.log("Waste type updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteWasteType = async (id) => {
  try {
    const wasteTypeRef = doc(db, "wasteTypes", id);
    await deleteDoc(wasteTypeRef);
    console.log("Waste type deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const getWasteTypeById = async (id: string) => {
  try {
    const wasteTypeRef = doc(db, "wasteTypes", id);
    const wasteTypeDoc = await getDoc(wasteTypeRef);

    if (wasteTypeDoc.exists()) {
      const wasteTypeData = { id: wasteTypeDoc.id, ...wasteTypeDoc.data() };
      console.log("Waste type retrieved successfully:", wasteTypeData);
      return wasteTypeData;
    } else {
      console.log("No such document!");
      throw new Error("Waste type not found");
    }
  } catch (error) {
    console.error("Error retrieving waste type:", error);
    throw new Error("Failed to fetch waste type by ID");
  }
};
