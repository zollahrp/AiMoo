// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE CONFIG DARI FIREBASE CONSOLE LU DI SINI
const firebaseConfig = {
  apiKey: "AIzaSyCcFovXBuFQEVIc6TMGrob50FC6uOqkh_A",
  authDomain: "aimoo-345eb.firebaseapp.com",
  projectId: "aimoo-345eb",
  storageBucket: "aimoo-345eb.firebasestorage.app",
  messagingSenderId: "425633217802",
  appId: "1:425633217802:web:603d122950780005a70ef3",
  measurementId: "G-FELR8F2NYP"
};
// Cek apakah firebase sudah jalan supaya tidak error saat refresh (Next.js trik)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Auth dan Database
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };