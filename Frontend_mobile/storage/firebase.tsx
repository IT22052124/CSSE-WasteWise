import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5krGSrH9mO408AoaEzDAfWi4-FZk6Yes",
  authDomain: "frontend-web-e454c.firebaseapp.com",
  projectId: "frontend-web-e454c",
  storageBucket: "frontend-web-e454c.appspot.com",
  messagingSenderId: "477577416048",
  appId: "1:477577416048:web:a9acef3ba4e0058f9fd3b5",
  measurementId: "G-PVHD7MMLSV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
