// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyB5krGSrH9mO408AoaEzDAfWi4-FZk6Yes",
//   authDomain: "frontend-web-e454c.firebaseapp.com",
//   projectId: "frontend-web-e454c",
//   storageBucket: "frontend-web-e454c.appspot.com",
//   messagingSenderId: "477577416048",
//   appId: "1:477577416048:web:a9acef3ba4e0058f9fd3b5",
//   measurementId: "G-PVHD7MMLSV",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { db, storage };


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDA_7kcXGORyc8_Wp-HYBpWWyMdGybPx6U",
  authDomain: "frontend-93631.firebaseapp.com",
  projectId: "frontend-93631",
  storageBucket: "frontend-93631.appspot.com",
  messagingSenderId: "411890392432",
  appId: "1:411890392432:web:0b7f234cd4013efbc403b5",
  measurementId: "G-V1JYYL0Z17",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };