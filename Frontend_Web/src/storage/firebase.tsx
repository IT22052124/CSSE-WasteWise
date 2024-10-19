import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDA_7kcXGORyc8_Wp-HYBpWWyMdGybPx6U",
  authDomain: "frontend-93631.firebaseapp.com",
  projectId: "frontend-93631",
  storageBucket: "frontend-93631.appspot.com",
  messagingSenderId: "411890392432",
  appId: "1:411890392432:web:0b7f234cd4013efbc403b5",
  measurementId: "G-V1JYYL0Z17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const storage = getStorage(app);

export { db };
