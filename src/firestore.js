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
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export async function saveUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS
// ─────────────────────────────────────────────────────────────────────────────

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

export async function getListings() {
  const q = query(
    collection(db, "listings"),
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUserListings(uid) {
  const q = query(
    collection(db, "listings"),
    where("ownerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateListing(listingId, data) {
  await updateDoc(doc(db, "listings", listingId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteListing(listingId) {
  await updateDoc(doc(db, "listings", listingId), { active: false });
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function addBooking(bookingData) {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "upcoming",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserBookings(uid) {
  const q = query(
    collection(db, "bookings"),
    where("driverUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOwnerBookings(uid) {
  const q = query(
    collection(db, "bookings"),
    where("ownerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateBookingStatus(bookingId, status) {
  await updateDoc(doc(db, "bookings", bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES (συνομιλίες μεταξύ driver & owner)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Δημιουργεί ή επιστρέφει conversation ID μεταξύ δύο χρηστών για συγκεκριμένη κράτηση.
 * ID = bookingId (1 conversation ανά κράτηση)
 */
export async function getOrCreateConversation(bookingId, driverUid, ownerUid, listingTitle) {
  const convRef = doc(db, "conversations", bookingId);
  const snap = await getDoc(convRef);
  if (!snap.exists()) {
    await setDoc(convRef, {
      bookingId,
      driverUid,
      ownerUid,
      listingTitle,
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
    });
  }
  return bookingId;
}

/** Στέλνει μήνυμα σε συνομιλία */
export async function sendMessage(conversationId, senderUid, senderName, text) {
  const msgRef = collection(db, "conversations", conversationId, "messages");
  await addDoc(msgRef, {
    senderUid,
    senderName,
    text,
    createdAt: serverTimestamp(),
    read: false,
  });
  // Ενημέρωση lastMessage στη conversation
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
  });
}

/** Real-time listener για μηνύματα συνομιλίας */
export function subscribeToMessages(conversationId, callback) {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, snap => {
    const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
}

/** Ανάκτηση όλων των conversations για έναν χρήστη */
export async function getUserConversations(uid) {
  const asDriver = query(collection(db, "conversations"), where("driverUid", "==", uid));
  const asOwner  = query(collection(db, "conversations"), where("ownerUid",  "==", uid));
  const [d, o] = await Promise.all([getDocs(asDriver), getDocs(asOwner)]);
  const all = [...d.docs, ...o.docs].map(doc => ({ id: doc.id, ...doc.data() }));
  // Αφαίρεση διπλότυπων
  return all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
}
