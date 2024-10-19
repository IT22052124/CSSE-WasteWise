import { db } from "../storage/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import bcrypt from "bcryptjs"; // For hashing passwords
import AsyncStorage from "@react-native-async-storage/async-storage";



// Function to sign in a collector
export const signInCollector = async (email, password) => {
  console.log("Attempting to sign in with email:", email);
  console.log("Entered password:", password); // Log the entered password

  try {
    // Query Firestore for the collector with the matching email
    const q = query(collection(db, "collectors"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "No collector found with this email" };
    }
    const collectorDoc = querySnapshot.docs[0];
    const collectorData = collectorDoc.data();
    const collectorId = collectorDoc.id;

    // Compare the entered password with the hashed password stored in Firestore
    const passwordMatch = await bcrypt.compare(password.trim(), collectorData.password.trim());

    if (!passwordMatch) {
      console.log("Password comparison failed"); // Debug log
      return { success: false, message: "Incorrect password" };
    }

    // Store collector details in AsyncStorage for session management
    await AsyncStorage.setItem(
      "collector",
      JSON.stringify({ ...collectorData, id: collectorId })
    );

    return {
      success: true,
      message: "Sign in successful",
      collector: { ...collectorData, id: collectorId },
    };
  } catch (error) {
    console.error("Error signing in collector:", error);
    return { success: false, message: "Collector sign-in failed" };
  }
};



// Function to get a collector by their ID
export const getCollectorById = async (collectorId) => {
  try {
    const collectorDoc = await db.collection("collector").doc(collectorId).get();

    if (collectorDoc.exists) {
      return { id: collectorDoc.id, ...collectorDoc.data() };
    } else {
      throw new Error("Collector not found");
    }
  } catch (error) {
    console.error("Error retrieving collector:", error);
    throw new Error("Collector retrieval failed");
  }
};

// Function to fetch all collector emails
export const getCollectorEmails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "collector"));
    const emails = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw new Error("Failed to fetch emails");
  }
};

// Function to fetch all collector usernames
export const getCollectorUsernames = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "collector"));
    const usernames = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username) {
        usernames.push(data.username);
      }
    });

    return usernames;
  } catch (error) {
    console.error("Error fetching usernames:", error);
    throw new Error("Failed to fetch usernames");
  }
};

// Function to get logged-in collector details from AsyncStorage
export const getCollectorDetails = async () => {
  try {
    const collectorData = await AsyncStorage.getItem("collector");
    if (collectorData) {
      const collector = JSON.parse(collectorData);
      return collector;
    }
  } catch (error) {
    console.error("Error retrieving collector data: ", error);
  }
};

// Function to get all records for a collector using collectorID
export const getCollectorRecords = async (collectorID) => {
  try {
    console.log(collectorID);

    if (!collectorID) {
      throw new Error("Collector ID must be provided");
    }

    // Query Firestore for all records with matching collectorID
    const recordsRef = collection(db, "wasteCollection"); // Assuming the collection name is 'wasteCollection'
    const q = query(recordsRef, where("collectorID", "==", collectorID));

    // Fetch the records
    const querySnapshot = await getDocs(q);

    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });

    return records; // Return the fetched records
  } catch (error) {
    console.error("Error fetching collector records:", error);
    throw new Error("Failed to fetch collector records");
  }
};



