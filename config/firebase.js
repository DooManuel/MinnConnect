// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRyFlxD_RQMft0tw5sEnmKNUyQHUCjt5E",
  authDomain: "minnconnect-47081.firebaseapp.com",
  projectId: "minnconnect-47081",
  storageBucket: "minnconnect-47081.appspot.com",
  messagingSenderId: "640327981621",
  appId: "1:640327981621:web:57991ae4e7f8fc53df2f7c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
