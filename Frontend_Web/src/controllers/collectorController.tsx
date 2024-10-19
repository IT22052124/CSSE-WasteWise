import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/storage/firebase";
import bcrypt from "bcryptjs"; // Make sure to install bcryptjs package

// Function to add a new collector
export const addCollector = async (collectorData) => {
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(collectorData.password, 10);

    const docRef = await addDoc(collection(db, "collectors"), {
      ...collectorData,
      password: hashedPassword, // Store hashed password
      createdAt: serverTimestamp(),
    });

    console.log("Collector added successfully:", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding collector:", e);
    throw e;
  }
};

// Function to retrieve all collectors
export const getCollectors = async () => {
  try {
    const collectorCollection = collection(db, "collectors");
    const collectorSnapshot = await getDocs(collectorCollection);
    const collectors = collectorSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Collectors retrieved successfully:", collectors);
    return collectors;
  } catch (error) {
    console.error("Error retrieving collectors:", error);
    throw new Error("Failed to fetch collectors");
  }
};

// Function to get the last Collector ID
export const getLastCollectorID = async () => {
  try {
    // Query the "collectors" collection, order by "collectorID" in descending order, and limit the result to 1
    const collectorCollection = collection(db, "collectors");
    const lastCollectorQuery = query(
      collectorCollection,
      orderBy("collectorID", "desc"),
      limit(1)
    );

    // Execute the query
    const collectorSnapshot = await getDocs(lastCollectorQuery);

    // Check if we have any collectors in the collection
    if (!collectorSnapshot.empty) {
      // Get the collectorID of the last collector
      const lastCollector = collectorSnapshot.docs[0].data();
      return lastCollector.collectorID; // Return the collectorID (e.g., "C004")
    } else {
      // If there are no collectors in the collection, return null
      return null;
    }
  } catch (error) {
    console.error("Error retrieving last collectorID:", error);
    throw new Error("Failed to fetch last collectorID");
  }
};
