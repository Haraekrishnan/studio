// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "taskmaster-pro-jkvw6.firebaseapp.com",
  projectId: "taskmaster-pro-jkvw6",
  storageBucket: "taskmaster-pro-jkvw6.appspot.com",
  messagingSenderId: "36734185297",
  appId: "1:36734185297:web:80c85d89659b67484d6323",
  databaseURL: "https://taskmaster-pro-jkvw6-default-rtdb.firebaseio.com",
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, app, storage };
