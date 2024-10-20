import { db } from "../storage/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const generateTruckId = async () => { // Generate the next truck ID
  const q = query(collection(db, "trucks"), orderBy("truckId", "desc")); // Query to get the latest truck ID
  const truckSnapshot = await getDocs(q); // Get the latest truck ID

  let lastTruckId = "Tru-000"; // Default truck ID
  if (!truckSnapshot.empty) { // Check if the truck collection is not empty
    lastTruckId = truckSnapshot.docs[0].data().truckId; // Get the latest truck ID
  }

  const numericPart = parseInt(lastTruckId.split("-")[1], 10) + 1; // Extract the numeric part and increment by 1
  return `Tru-${numericPart.toString().padStart(3, "0")}`; // Return the new truck ID
};
