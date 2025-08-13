// src/services/firebase/config.ts
import { initializeApp, getApps, getApp  } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ Use variáveis de ambiente seguras (.env)
const firebaseConfig = {
  apiKey: "AIzaSyALtmPe6MSopVHibUBzpJdgeh15bsfobl0",
  authDomain: "hemoglovida-ae282.firebaseapp.com",
  projectId: "hemoglovida-ae282",
  storageBucket: "hemoglovida-ae282.firebasestorage.app",
  messagingSenderId: "397475084823",
  appId: "1:397475084823:web:ed6c455752fedfe94d3a52",
  measurementId: "G-2R233W8R4J"
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
