// src/firestore.js
// ── Όλες οι λειτουργίες βάσης δεδομένων (Firestore) ──

import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

/** Αποθήκευση προφίλ χρήστη μετά την εγγραφή */
export async function saveUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Ανάκτηση προφίλ χρήστη */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Ενημέρωση προφίλ χρήστη */
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS (θέσεις parking)
// ─────────────────────────────────────────────────────────────────────────────

/** Δημοσίευση νέας θέσης */
export async function addListing(listingData) {
  const docRef = await addDoc(collection(db, "listings"), {
    ...listingData,
    createdAt: serverTimestamp(),
    rating: 5.0,
    reviews: 0,
    active: true,
  });
  return docRef.id;
}

/** Ανάκτηση όλων των ενεργών θέσεων */
export async function getListings() {
  const q = query(
    collection(db, "listings"),
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ανάκτηση θέσεων συγκεκριμένου χρήστη */
export async function getUserListings(uid) {
  const q = query(
    collection(db, "listings"),
    where("ownerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ενημέρωση θέσης */
export async function updateListing(listingId, data) {
  await updateDoc(doc(db, "listings", listingId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Διαγραφή θέσης */
export async function deleteListing(listingId) {
  await updateDoc(doc(db, "listings", listingId), { active: false });
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKINGS (κρατήσεις)
// ─────────────────────────────────────────────────────────────────────────────

/** Δημιουργία νέας κράτησης */
export async function addBooking(bookingData) {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "upcoming",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Ανάκτηση κρατήσεων χρήστη (ως οδηγός) */
export async function getUserBookings(uid) {
  const q = query(
    collection(db, "bookings"),
    where("driverUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ανάκτηση κρατήσεων για τις θέσεις ενός ιδιοκτήτη */
export async function getOwnerBookings(uid) {
  const q = query(
    collection(db, "bookings"),
    where("ownerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ενημέρωση status κράτησης */
export async function updateBookingStatus(bookingId, status) {
  await updateDoc(doc(db, "bookings", bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
