import { db } from "../storage/firebase";
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

export const getWasteCollectionsByUserID = async (userID) => {
  try {
    // Step 1: Prepare the document reference for the userID
    const userRef = doc(db, "users", userID); // Reference to the user's document

    // Step 2: Construct the query to fetch waste collections for the user
    const wasteCollectionQuery = query(
      collection(db, "wasteCollection"), // Query the wasteCollections collection
      where("userRef", "==", userRef) // Filter by user reference
    );

    // Step 3: Execute the query and retrieve the documents
    const querySnapshot = await getDocs(wasteCollectionQuery);

    // Check if any documents are found
    if (querySnapshot.empty) {
      console.log("No waste collections found for this user.");
      return []; // Return an empty array or handle the case appropriately
    }

    // Step 4: Initialize an object to accumulate monthly data
    const wasteData = {};

    // Step 5: Process the retrieved waste collections
    querySnapshot.docs.forEach((doc) => {
      const { PerKg, Payback, wasteWeight, collectedAt } = doc.data();
      const date = collectedAt.toDate(); // Convert Firestore timestamp to JS Date object

      // Format the date as 'Month Year' (e.g., 'October 2024')
      const month = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(date);

      const amount = PerKg * wasteWeight;
      const payBackAmount = Payback * wasteWeight;

      // Accumulate data by month
      if (!wasteData[month]) {
        wasteData[month] = {
          totalAmount: 0,
          totalPayBackAmount: 0,
          totalWaste: 0,
          totalAmountToBePaid: 0, // Initialize totalAmountToBePaid
        };
      }

      wasteData[month].totalAmount += amount;
      wasteData[month].totalPayBackAmount += payBackAmount;
      wasteData[month].totalWaste += wasteWeight;
      wasteData[month].totalAmountToBePaid =
        wasteData[month].totalAmount - wasteData[month].totalPayBackAmount;
    });

    // Step 6: Format the results as an array of objects
    const result = Object.keys(wasteData).map((month) => ({
      userRef: userRef.path,
      month, // The month is already in 'October 2024' format
      totalAmount: wasteData[month].totalAmount,
      totalPayBackAmount: wasteData[month].totalPayBackAmount,
      totalWaste: wasteData[month].totalWaste,
      totalAmountToBePaid: wasteData[month].totalAmountToBePaid, // Include totalAmountToBePaid
    }));

    // Step 7: Sort results by month (if needed)
    result.sort((a, b) => new Date(a.month) - new Date(b.month));

    // Return the results
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error retrieving waste collections:", error);
    throw new Error("Failed to retrieve waste collections");
  }
};

