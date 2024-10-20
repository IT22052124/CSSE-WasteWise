import { db } from "../storage/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const generateTruckId = async () => {
  const q = query(collection(db, "trucks"), orderBy("truckId", "desc"));
  const truckSnapshot = await getDocs(q);

  let lastTruckId = "Tru-000";
  if (!truckSnapshot.empty) {
    lastTruckId = truckSnapshot.docs[0].data().truckId;
  }

  const numericPart = parseInt(lastTruckId.split("-")[1], 10) + 1;
  return `Tru-${numericPart.toString().padStart(3, "0")}`;
};
