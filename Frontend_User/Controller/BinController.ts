import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../storage/firebase";

export const getBinTypes = async () => {
  try {
    // Step 1: Reference the binTypes collection
    const binTypesRef = collection(db, "binTypes");

    // Step 2: Get documents from the collection
    const querySnapshot = await getDocs(binTypesRef);

    // Step 3: Process the results into an array of bin types
    const binTypes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    console.log("Bin types retrieved:", binTypes);

    // Return the retrieved bin types
    return binTypes;
  } catch (error) {
    console.error("Error retrieving bin types:", error);
    throw new Error("Failed to retrieve bin types");
  }
};

export const findBinsByUserEmail = async (email: string) => {
  try {
    // Reference the 'bins' collection in Firestore
    const binsRef = collection(db, "bins");

    // Create a query that looks for bins where the 'user.email' field matches the provided email
    const q = query(binsRef, where("user.email", "==", email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If no bins are found, return an empty array
    if (querySnapshot.empty) {
      console.log("No bins found for this user.");
      return [];
    }

    // Extract and return bin data
    const bins = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bins;
  } catch (error) {
    console.error("Error finding bins by user email:", error);
    throw new Error("Unable to find bins for the user.");
  }
};

export const createBinRequest = async (
  binType,
  binTypeId,
  userId,
  capacity
) => {
  try {
    const binID = await generateBinID();

    const userRef = doc(db, "users", userId);
    const binRef = doc(db, "binTypes", binTypeId);
    // Create a new bin request object
    const newBinRequest = {
      binID: binID,
      binType: binType,
      binTypeId: binRef,
      userId: userRef,
      capacity: capacity,
      status: "Pending", // Set status to 'Pending'
      createdAt: new Date(), // Optionally store the timestamp when the request was created
    };

    // Reference to the 'binRequests' collection
    const binRequestsCollection = collection(db, "binRequests");

    // Add a new document with an auto-generated ID
    const docRef = await addDoc(binRequestsCollection, newBinRequest);

    console.log("Bin request created successfully with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating bin request: ", error);
  }
};

const generateBinID = async () => {
  const binQuery = query(
    collection(db, "binRequests"),
    orderBy("binID", "desc"), // Order by paymentID in descending order
    limit(1) // Limit to the latest document
  );

  const querySnapshot = await getDocs(binQuery);
  let nextID = 1; // Default to 1 if no payments exist

  if (!querySnapshot.empty) {
    const lastDoc = querySnapshot.docs[0];
    const lastBinID = lastDoc.data().binID;
    const lastNumber = parseInt(lastBinID.replace("P", ""), 10); // Extract number from lastPaymentID
    nextID = lastNumber + 1; // Increment
  }

  // Format the payment ID with leading zeros
  return `P${String(nextID).padStart(4, "0")}`;
};
