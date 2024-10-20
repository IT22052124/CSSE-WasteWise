// reportController.js

import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../storage/firebase"; // Your Firebase config
import { isWithinInterval } from 'date-fns'; // Importing necessary functions


export const fetchWasteCollectionData = async (fromDate, toDate) => {
  const q = query(
    collection(db, "wasteCollection"),
    where("collectedAt", ">=", new Date(fromDate)),
    where("collectedAt", "<=", new Date(toDate))
  );

  const querySnapshot = await getDocs(q);
  let collectorData = {};

  querySnapshot.forEach((doc) => {
    const wasteData = doc.data();
    if (wasteData && wasteData.collectorname && wasteData.wasteWeight) {
      const collectorName = wasteData.collectorname;
      const collectorID = wasteData.collectorID; // Added collector ID
      const wasteWeight = wasteData.wasteWeight;
      const binType = wasteData.WasteType?.binType; // Safely access binType

      // Aggregate waste weight by collector
      if (!collectorData[collectorName]) {
        collectorData[collectorName] = {
          totalWaste: 0,
          collectorID: collectorID,
          binTypes: new Set(), // To track unique bin types
        };
      }
      collectorData[collectorName].totalWaste += wasteWeight;
      collectorData[collectorName].binTypes.add(binType); // Add bin type to the set
    }
  });

  const result = Object.entries(collectorData).map(([collectorName, data]) => ({
    collectorName,
    totalWasteCollected: data.totalWaste,
    collectorID: data.collectorID,
    binTypes: Array.from(data.binTypes), // Convert Set to Array
  }));

  console.log("Retrieved Collector Data:", result); // Log the aggregated data
  return result;
};

export const fetchRouteOptimizationData = async (fromDate, toDate) => {
  const q = query(
    collection(db, "routeCollection"),
    where("timestamp", ">=", new Date(fromDate)),
    where("timestamp", "<=", new Date(toDate))
  );
  
  const querySnapshot = await getDocs(q);
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  
  return data;
};

export const fetchWasteTrendsData = async (fromDate, toDate) => {
  const q = query(
    collection(db, "wasteCollection"),
    where("collectedAt", ">=", new Date(fromDate)),
    where("collectedAt", "<=", new Date(toDate))
  );

  const querySnapshot = await getDocs(q);
  let wasteData = {};

  // Process each document to sum waste levels by bin type
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const binType = data.WasteType?.binType; // Safely access binType
    const wasteLevel = data.wasteWeight; // Assume each document has a 'wasteLevel' field

    // Initialize bin type entry if it doesn't exist
    if (!wasteData[binType]) {
      wasteData[binType] = 0; // Initialize sum to 0
    }

    // Accumulate the waste level for the corresponding bin type
    wasteData[binType] += wasteLevel; // Add the current waste level to the bin type's total
  });

  // Transform the wasteData object into an array for easier use
  const result = Object.keys(wasteData).map((binType) => ({
    binType,
    totalWasteLevel: wasteData[binType],
  }));

  console.log(result);
  return result; // Return the result containing bin type and total waste level
};


export const fetchRecyclableWasteData = async (fromDate, toDate) => {
  const q = query(
    collection(db, "wasteCollection"),
    where("collectedAt", ">=", new Date(fromDate)),
    where("collectedAt", "<=", new Date(toDate))
  );
  
  const querySnapshot = await getDocs(q);
  let data = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  
  return data;
};


export const fetchAccountPaymentData = async (fromDate, toDate) => {
  const q = query(
    collection(db, "payments"),
    where("status", "==", "Success") // Filter by status "Success"
  );

  const querySnapshot = await getDocs(q);
  const userPaymentSummary = {}; // Object to hold payment summaries

  for (const docSnapshot of querySnapshot.docs) {
    const paymentData = docSnapshot.data();
    const paymentDate = paymentData.date.toDate(); // Convert Firestore timestamp to Date

    // Check if the payment date is within the specified range
    if (isWithinInterval(paymentDate, { start: new Date(fromDate), end: new Date(toDate) })) {
      const userRef = paymentData.userID; // Firestore document reference for user
      const userDoc = await getDoc(userRef); // Get user document
     

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData); //
        const userEmail = userData.email; // Get user email
        const username =userData.username; // Get user


        // Initialize the user's payment summary if it doesn't exist
        if (!userPaymentSummary[paymentData.userID]) {
          userPaymentSummary[paymentData.userID] = {
            userId: username,
            userEmail: userEmail,
            totalAmount: 0,
          };
        }

        // Sum the amounts
        userPaymentSummary[paymentData.userID].totalAmount += paymentData.amount; // Ensure `amount` is a field in paymentData
      } else {
        console.warn(`User not found for payment ID: ${paymentData.userID}`);
      }
    }
  }

  // Convert the summary object into an array for easier use
  const summaryArray = Object.values(userPaymentSummary);
  console.log(summaryArray); // Display the aggregated user payment summary
  return summaryArray; // Return the array of user payment summaries
};
