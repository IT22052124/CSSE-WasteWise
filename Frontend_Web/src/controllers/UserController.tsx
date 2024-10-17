import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/storage/firebase";

// Function to get a user by email
export const getUserByEmail = async (email) => {
  try {
    const userCollection = collection(db, "users");
    const emailQuery = query(userCollection, where("email", "==", email));

    const userSnapshot = await getDocs(emailQuery);

    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data();
      console.log("User retrieved successfully:", user);
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(`Error retrieving user by email ${email}:`, error);
    throw new Error("Failed to retrieve user by email");
  }
};
