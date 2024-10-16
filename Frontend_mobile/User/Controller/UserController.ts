import { db } from "../../storage/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs"; // for hashing passwords

// Create a new user
export const createUser = async (userData) => {
  const { username, email, phone, address, password } = userData;

  try {
    await addDoc(collection(db, "users"), {
      username: username,
      email: email,
      phone: phone,
      address: address,
      password: password,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw new Error("User retrieval failed");
  }
};

export const getEmails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const emails = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    return emails; // Return the array of emails
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw new Error("Failed to fetch emails");
  }
};

export const getUsernames = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usernames = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username) {
        usernames.push(data.username);
      }
    });

    return usernames; // Return the array of usernames
  } catch (error) {
    console.error("Error fetching usernames:", error);
    throw new Error("Failed to fetch usernames");
  }
};

export const signInUser = async (email, password) => {
  try {
    // Query the database for the user with the given email
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No user found with this email");
    }

    // Assuming there's only one user per email
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Compare the provided password with the stored password
    if (password !== userData.password) {
      throw new Error("Incorrect password");
    }

    // Successful sign-in
    return { message: "Sign in successful", user: userData };
  } catch (error) {
    console.error("Error signing in user:", error);
    // Throw a new error with a more specific message
    throw new Error(error.message || "User sign-in failed");
  }
};
