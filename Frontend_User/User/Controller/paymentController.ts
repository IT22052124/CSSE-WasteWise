import { db } from "../../storage/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
} from "firebase/firestore";
import bcrypt from "bcryptjs"; // for hashing passwords
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to create a payment
export const createPayment = async (amount, userID, method, slipUrl) => {
  try {
    // Step 1: Generate Payment ID (assuming you have a function for this)
    const paymentID = await generatePaymentID();

    // Step 2: Prepare the document reference for the userID (document name in "users" collection)
    const userRef = doc(db, "users", userID); // Create a reference to the user's document

    // Step 3: Prepare payment data
    const paymentData = {
      paymentID: paymentID,
      amount: amount,
      userID: userRef, // Store the document reference, not just the string
      date: Timestamp.now(), // Current timestamp
      method: method,
      status: method === "card" ? "Success" : "Pending", // Status depends on payment method
      slipUrl: method === "card" ? null : slipUrl, // Slip URL for bank deposit, null for card
    };

    // Step 4: Add payment to the "payments" collection in Firestore
    await addDoc(collection(db, "payments"), paymentData);

    console.log("Payment created successfully:", paymentData);
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Payment creation failed");
  }
};

export const getPaymentsByUserID = async (userID, method = null) => {
  try {
    // Step 1: Prepare the document reference for the userID
    const userRef = doc(db, "users", userID); // Reference to the user's document

    // Step 2: Construct the query
    let paymentQuery = query(
      collection(db, "payments"), // Query the payments collection
      where("userID", "==", userRef)
    );

    // If method is specified, add a method filter to the query
    if (method) {
      paymentQuery = query(
        paymentQuery, // Add to the existing query
        where("method", "==", method) // Filter by payment method (e.g., 'card' or 'bank')
      );
    }

    // Step 3: Execute the query and retrieve documents
    const querySnapshot = await getDocs(paymentQuery);

    // Step 4: Process the results into an array of payments
    const payments = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    payments.sort((a, b) => b.date - a.date);

    // Return the retrieved payments
    return payments;
  } catch (error) {
    console.error("Error retrieving payments:", error);
    throw new Error("Failed to retrieve payments");
  }
};

// Function to generate the next Payment ID
const generatePaymentID = async () => {
  const paymentQuery = query(
    collection(db, "payments"),
    orderBy("paymentID", "desc"), // Order by paymentID in descending order
    limit(1) // Limit to the latest document
  );

  const querySnapshot = await getDocs(paymentQuery);
  let nextID = 1; // Default to 1 if no payments exist

  if (!querySnapshot.empty) {
    const lastDoc = querySnapshot.docs[0];
    const lastPaymentID = lastDoc.data().paymentID;
    const lastNumber = parseInt(lastPaymentID.replace("P", ""), 10); // Extract number from lastPaymentID
    nextID = lastNumber + 1; // Increment
  }

  // Format the payment ID with leading zeros
  return `P${String(nextID).padStart(4, "0")}`;
};
