// src/firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXeSAdy84gekuw3o_7HzpITGFDhxr7rwI",
  authDomain: "healthykong-388f9.firebaseapp.com",
  projectId: "healthykong-388f9",
  storageBucket: "healthykong-388f9.firebasestorage.app",
  messagingSenderId: "43845536265",
  appId: "1:43845536265:web:d06eb287940675fd6786d8",
  measurementId: "G-491DK1F3PH",
} as const;

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
