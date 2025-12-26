// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_n3GJtYr4W1nhdK6SFDyn-gu3bEvtKuE",
  authDomain: "mobilespare-4b38a.firebaseapp.com",
  projectId: "mobilespare-4b38a",
  storageBucket: "mobilespare-4b38a.firebasestorage.app",
  messagingSenderId: "470099945954",
  appId: "1:1062636584346:web:f933dbaf0e72e85bf90e23",
  measurementId: "G-8RHDPMWWJJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
