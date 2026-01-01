import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 這裡請貼上你從 Firebase Console 獲得的資訊
  apiKey: "AIzaSyCzzIH7smZoQOxwqR5bYCdFc4v4_IVNt1Q",
  authDomain: "meridianprojec.firebaseapp.com",
  databaseURL: "https://meridianprojec-default-rtdb.firebaseio.com",
  projectId: "meridianprojec",
  storageBucket: "meridianprojec.firebasestorage.app",
  messagingSenderId: "686654473448",
  appId: "1:686654473448:web:7ce772c1e96c2e9474755d",
  measurementId: "G-VDW94L38X2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);