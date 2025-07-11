// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZRzVFHIASG-LH6M_8xX0u63piyagIAeo",
  authDomain: "taskmaster-pro-jkvw6.firebaseapp.com",
  databaseURL: "https://taskmaster-pro-jkvw6-default-rtdb.firebaseio.com",
  projectId: "taskmaster-pro-jkvw6",
  storageBucket: "taskmaster-pro-jkvw6.appspot.com",
  messagingSenderId: "566300415743",
  appId: "1:566300415743:web:8801a6887881d9b46d9eca",
  measurementId: "G-492SH68M8G"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


// Set authentication persistence
if (typeof window !== "undefined") {
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting authentication persistence:", error);
      });
}


export { db, auth, app, storage };