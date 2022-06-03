// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH2ij3hH9bdfieodcgiAP-YfgMYDyssTQ",
  authDomain: "fir-nextjs-c2e75.firebaseapp.com",
  projectId: "fir-nextjs-c2e75",
  storageBucket: "fir-nextjs-c2e75.appspot.com",
  messagingSenderId: "113899552732",
  appId: "1:113899552732:web:04c7fa90649b9b7c4d9919",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider };
