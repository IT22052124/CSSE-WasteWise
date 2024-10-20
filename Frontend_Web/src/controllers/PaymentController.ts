import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/storage/firebase";

export const getAllPayments = async () => { // Fetch all payments
  try {
    const paymentsCollectionRef = collection(db, "payments");

    // Query to order payments by date (descending)
    const paymentsQuery = query(paymentsCollectionRef, orderBy("date", "desc"));

    // Get the payment documents
    const paymentsSnapshot = await getDocs(paymentsQuery);

    // Array to store payments with user emails
    const paymentsWithUserEmails = [];

    // Loop through each payment and fetch the associated user's email
    for (let paymentDoc of paymentsSnapshot.docs) {
      const paymentData = paymentDoc.data();

      // Check if userID is valid and exists
      if (!paymentData.userID) {
        console.error(`Missing or invalid userID in payment ${paymentDoc.id}`);
        continue; // Skip this iteration if no valid userID
      }

      console.log(paymentData.userID);

      try {
        // Fetch user details using userID
        const userDoc = await getDoc(paymentData.userID);

        if (userDoc.exists()) {
          const userEmail = userDoc.data().email;
          paymentsWithUserEmails.push({
            id: paymentDoc.id,
            ...paymentData,
            userEmail,
          });
        } else {
          console.error(`User with ID ${paymentData.userID} not found`);
        }
      } catch (error) {
        console.error(
          `Error fetching user data for ID ${paymentData.userID}:`,
          error
        );
      }
    }

    return paymentsWithUserEmails; // Return the array of payments with user emails
  } catch (error) {
    console.error("Error retrieving payments with user emails:", error);
    throw new Error("Failed to retrieve payments with user emails");
  }
};

export const updatePaymentStatus = async (paymentId, newStatus) => { // Update payment status
  try {
    // Create a reference to the specific payment document
    console.log(paymentId, newStatus)
    const paymentDocRef = doc(db, "payments", paymentId);
    
    // Update the payment status
    await updateDoc(paymentDocRef, {
      status: newStatus,
    });

    console.log(`Payment status updated to ${newStatus} for payment ID: ${paymentId}`);
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status");
  }
};
