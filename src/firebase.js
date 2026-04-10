// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrwnCeI4hRBRWeAblOm1pK30mmHY6XAjQ",
  authDomain: "parkshare-c1a70.firebaseapp.com",
  databaseURL: "https://parkshare-c1a70-default-rtdb.firebaseio.com",
  projectId: "parkshare-c1a70",
  storageBucket: "parkshare-c1a70.firebasestorage.app",
  messagingSenderId: "550902279245",
  appId: "1:550902279245:web:ca2d9e9b0bbc65aebec004",
  measurementId: "G-5TFL4NF0MF"
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getFirestore(app);      // ← ΝΕΟ
export const googleProvider = new GoogleAuthProvider();

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function registerWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
