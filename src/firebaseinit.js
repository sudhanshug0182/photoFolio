// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyA_uP64IG-3W3F6z4ndCTVSP6r3AxzBEJ0",
  authDomain: "photofolio-mini.firebaseapp.com",
  projectId: "photofolio-mini",
  storageBucket: "photofolio-mini.appspot.com",
  messagingSenderId: "472457912697",
  appId: "1:472457912697:web:40fd7e49b097ff467b4fa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);