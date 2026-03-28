import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrwnCeI4hRBRWeAblOm1pK30mmHY6XAjQ",
  authDomain: "parkshare-c1a70.firebaseapp.com",
  projectId: "parkshare-c1a70",
  storageBucket: "parkshare-c1a70.firebasestorage.app",
  messagingSenderId: "550902279245",
  appId: "1:550902279245:web:ca2d9e9b0bbc65aebec004"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

export const storage = getStorage(app);