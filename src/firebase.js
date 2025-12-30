import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 這裡請貼上你從 Firebase Console 獲得的資訊
  apiKey: "AIzaSyC_dA_c7sbjBI7f2n31L3Sz1i3wOoMg94I",
  authDomain: "todolist-1025c.firebaseapp.com",
  projectId: "todolist-1025c",
  storageBucket: "todolist-1025c.firebasestorage.app",
  messagingSenderId: "8167388984",
  appId: "1:8167388984:web:e94f6efb3106081d0573cd",
  measurementId: "G-PHXWX367QW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);