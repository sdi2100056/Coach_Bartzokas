import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../firebase";

// Συλλογές
const LISTINGS_COLLECTION = "listings";
const BOOKINGS_COLLECTION = "bookings";
const USERS_COLLECTION = "users";
const STATS_COLLECTION = "stats";

// ─── LISTINGS (Θέσεις στάθμευσης) ──────────────────────────────────────────

// Προσθήκη νέας θέσης
export const addListing = async (listingData, userId) => {
  try {
    const newListing = {
      ...listingData,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 5.0,
      reviews: 0,
      totalBookings: 0,
      active: true
    };
    
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), newListing);
    return { id: docRef.id, ...newListing };
  } catch (error) {
    console.error("Error adding listing:", error);
    throw error;
  }
};

// Λήψη όλων των ενεργών θέσεων
export const getAllListings = async () => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where("active", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    return listings;
  } catch (error) {
    console.error("Error getting listings:", error);
    throw error;
  }
};

// Λήψη θέσεων συγκεκριμένου χρήστη
export const getUserListings = async (userId) => {
  try {
    const q = query(
      collection(db, LISTINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    return listings;
  } catch (error) {
    console.error("Error getting user listings:", error);
    throw error;
  }
};

// Λήψη συγκεκριμένης θέσης
export const getListingById = async (listingId) => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, listingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting listing:", error);
    throw error;
  }
};

// Ενημέρωση θέσης
export const updateListing = async (listingId, updateData) => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

// Διαγραφή/Απενεργοποίηση θέσης
export const deactivateListing = async (listingId) => {
  try {
    const docRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(docRef, {
      active: false,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error deactivating listing:", error);
    throw error;
  }
};

// ─── BOOKINGS (Κρατήσεις) ───────────────────────────────────────────────────

// Δημιουργία νέας κράτησης
export const addBooking = async (bookingData, userId, listingId) => {
  try {
    // Δημιουργία της κράτησης
    const newBooking = {
      ...bookingData,
      userId: userId,
      listingId: listingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "upcoming", // upcoming, active, completed, cancelled
      bookingCode: generateBookingCode()
    };
    
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), newBooking);
    
    // Ενημέρωση στατιστικών της θέσης
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      totalBookings: bookingData.totalBookings ? bookingData.totalBookings + 1 : 1,
      updatedAt: serverTimestamp()
    });
    
    // Ενημέρωση στατιστικών χρήστη
    await updateUserStats(userId, bookingData.totalAmount);
    
    return { id: docRef.id, ...newBooking };
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
};

// Λήψη κρατήσεων χρήστη
export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    for (const doc of querySnapshot.docs) {
      const bookingData = { id: doc.id, ...doc.data() };
      // Προσθήκη πληροφοριών της θέσης
      if (bookingData.listingId) {
        const listing = await getListingById(bookingData.listingId);
        bookingData.listing = listing;
      }
      bookings.push(bookingData);
    }
    return bookings;
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw error;
  }
};

// Λήψη κρατήσεων για θέσεις χρήστη (ως ιδιοκτήτης)
export getOwnerBookings = async (userId) => {
  try {
    // Πρώτα βρίσκουμε όλες τις θέσεις του χρήστη
    const userListings = await getUserListings(userId);
    const listingIds = userListings.map(l => l.id);
    
    if (listingIds.length === 0) return [];
    
    // Μετά βρίσκουμε όλες τις κρατήσεις για αυτές τις θέσεις
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("listingId", "in", listingIds),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
  } catch (error) {
    console.error("Error getting owner bookings:", error);
    throw error;
  }
};

// Ενημέρωση κατάστασης κράτησης
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

// Ακύρωση κράτησης
export const cancelBooking = async (bookingId) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

// ─── USERS (Χρήστες) ────────────────────────────────────────────────────────

// Δημιουργία/Ενημέρωση προφίλ χρήστη
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(userRef, {
        ...userData,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        totalSpent: 0,
        totalEarned: 0,
        totalBookings: 0,
        totalListings: 0
      });
    }
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Λήψη προφίλ χρήστη
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Ενημέρωση στατιστικών χρήστη
export const updateUserStats = async (userId, amount) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        totalSpent: (currentData.totalSpent || 0) + amount,
        totalBookings: (currentData.totalBookings || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
};

// Ενημέρωση εσόδων ιδιοκτήτη
export const updateOwnerEarnings = async (userId, amount) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        totalEarned: (currentData.totalEarned || 0) + amount,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error updating owner earnings:", error);
  }
};

// ─── STATS (Στατιστικά εφαρμογής) ──────────────────────────────────────────

// Ενημέρωση γενικών στατιστικών
export const updateAppStats = async (type, value = 1) => {
  try {
    const statsRef = doc(db, STATS_COLLECTION, "appStats");
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      const updates = {};
      updates[type] = (statsDoc.data()[type] || 0) + value;
      await updateDoc(statsRef, updates);
    } else {
      await setDoc(statsRef, {
        totalListings: type === "listings" ? value : 0,
        totalBookings: type === "bookings" ? value : 0,
        totalUsers: type === "users" ? value : 0,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error updating app stats:", error);
  }
};

// Λήψη γενικών στατιστικών
export const getAppStats = async () => {
  try {
    const docRef = doc(db, STATS_COLLECTION, "appStats");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {
      totalListings: 0,
      totalBookings: 0,
      totalUsers: 0
    };
  } catch (error) {
    console.error("Error getting app stats:", error);
    throw error;
  }
};

// ─── ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ─────────────────────────────────────────────────

// Δημιουργία μοναδικού κωδικού κράτησης
const generateBookingCode = () => {
  const prefix = "PK";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Έλεγχος διαθεσιμότητας θέσης για συγκεκριμένη ημερομηνία/ώρα
export const checkAvailability = async (listingId, date, time, duration) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("listingId", "==", listingId),
      where("status", "in", ["upcoming", "active"]),
      where("bookingDate", "==", date)
    );
    
    const querySnapshot = await getDocs(q);
    // Εδώ μπορείτε να προσθέσετε πιο σύνθετη λογική ελέγχου διαθεσιμότητας
    return querySnapshot.empty; // Απλή υλοποίηση - επιστρέφει true αν δεν υπάρχουν κρατήσεις για αυτή την ημερομηνία
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};