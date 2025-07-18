import { db } from "../storage/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

//create a new user
export const createUser = async (userData) => {
  const { username, email, phone, address, password } = userData;

  //const salt = await bcrypt.genSalt(10);

  //const hashedPassword = await bcrypt.hash(password, salt);

  //console.log(hashedPassword);

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

//get a user by his id
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

//get all emails of users
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

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw new Error("Failed to fetch emails");
  }
};

//get all user names of users
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

    return usernames;
  } catch (error) {
    console.error("Error fetching usernames:", error);
    throw new Error("Failed to fetch usernames");
  }
};

//handle sign in
export const signInUser = async (email, password) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "No user found with this email" };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    //const hashedPassword = userData.password;

    //const isMatch = await bcrypt.compare(password, hashedPassword);

    if (password != userData.password) {
      return { success: false, message: "Incorrect password" };
    }

    return {
      success: true,
      message: "Sign in successful",
      user: { ...userData, id: userId },
    };
  } catch (error) {
    console.error("Error signing in user:", error);
    return { success: false, message: "User sign-in failed" };
  }
};

//get the user from async storage
export const getUserDetails = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user;
    }
  } catch (error) {
    console.error("Error retrieving user data: ", error);
  }
};

export const addPageView = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const pageViewRef = doc(db, "globalStats", today);
    const docSnapshot = await getDoc(pageViewRef);
    if (docSnapshot.exists()) {
      await updateDoc(pageViewRef, {
        views: increment(1),
        lastViewedAt: serverTimestamp(),
      });
    } else {
      await setDoc(pageViewRef, {
        views: 1,
        createdAt: serverTimestamp(),
        lastViewedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error updating page view:", error);
    throw new Error("Failed to update page view");
  }
};
