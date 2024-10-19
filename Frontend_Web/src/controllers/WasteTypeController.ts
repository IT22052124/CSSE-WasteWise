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
import { db } from "../storage/firebase";

interface WasteType {
  id: string;
  wasteType: string;
  description: string;
}

interface BinType {
  id: string;
  wasteTypes: string[]; // Assuming it's an array of waste type strings
  binType: string;
  chargingPerKg: number;
  incentivesPerKg: number;
  selectedColor: string;
}

export const addWasteType = async (wasteTypeData) => {
  try {
    const docRef = await addDoc(collection(db, "wasteTypes"), {
      ...wasteTypeData,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getWasteTypesWithBinInfo = async (): Promise<
  (WasteType & {
    binType?: string;
    chargingPerKg?: number;
    incentivesPerKg?: number;
    selectedColor?: string;
    Bin?: boolean;
  })[]
> => {
  try {
    // Fetch waste types
    const wasteTypeCollection = collection(db, "wasteTypes");
    const wasteTypeSnapshot = await getDocs(wasteTypeCollection);
    const wasteTypes: WasteType[] = wasteTypeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteType[];

    // Fetch bin types
    const binTypeCollection = collection(db, "binTypes");
    const binTypeSnapshot = await getDocs(binTypeCollection);
    const binTypes: BinType[] = binTypeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BinType[];

    // Map waste types and merge matching bin type data
    const wasteTypesWithBinInfo = wasteTypes.map((wasteType) => {
      const matchingBinType = binTypes.find((binType) =>
        binType.wasteTypes.includes(wasteType.wasteType)
      );

      if (matchingBinType) {
        return {
          ...wasteType,
          binType: matchingBinType.binType,
          chargingPerKg: matchingBinType.chargingPerKg,
          incentivesPerKg: matchingBinType.incentivesPerKg,
          selectedColor: matchingBinType.selectedColor,
          Bin: true,
        };
      }
      return wasteType;
    });

    return wasteTypesWithBinInfo;
  } catch (error) {
    console.error("Error retrieving waste types with bin info:", error);
    throw new Error("Failed to fetch waste types and bin info");
  }
};

export const updateWasteType = async (id, updatedWasteTypeData) => {
  try {
    const wasteTypeRef = doc(db, "wasteTypes", id);
    await updateDoc(wasteTypeRef, {
      ...updatedWasteTypeData,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteWasteType = async (id) => {
  try {
    const wasteTypeRef = doc(db, "wasteTypes", id);
    await deleteDoc(wasteTypeRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const getWasteTypeById = async (id: string) => {
  const wasteTypeRef = doc(db, "wasteTypes", id);
  const wasteTypeDoc = await getDoc(wasteTypeRef);

  if (wasteTypeDoc.exists()) {
    return { id: wasteTypeDoc.id, ...wasteTypeDoc.data() };
  } else {
    throw new Error("Waste type not found");
  }
};
