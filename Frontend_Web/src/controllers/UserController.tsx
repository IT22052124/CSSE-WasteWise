import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/storage/firebase";

// Function to get a user by email

// Function to get a user by email
export const getUserByEmail = async (email) => {
  try {
    const userCollection = collection(db, "users"); // Get reference to 'users' collection
    const emailQuery = query(userCollection, where("email", "==", email)); // Create query for email

    const userSnapshot = await getDocs(emailQuery); // Execute the query

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0]; // Get the first document
      const userData = userDoc.data(); // Retrieve data
      const userId = userDoc.id; // Get the document ID

      console.log("User retrieved successfully:", userData);

      // Return both user data and document ID
      return {
        id: userId, // Include the document ID
        ...userData, // Spread the user data
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(`Error retrieving user by email ${email}:`, error);
    throw new Error("Failed to retrieve user by email");
  }
};

