// ── auth.js ──
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  reload,
} from "firebase/auth";
import { auth } from "./firebase";
import { saveUserProfile } from "./firestore";

// ── Εγγραφή νέου χρήστη + αποστολή email επαλήθευσης ──
export const registerUser = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await saveUserProfile(user.uid, {
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      emailVerified: false,
    });

    // Στέλνουμε email επαλήθευσης αμέσως μετά την εγγραφή
    await sendEmailVerification(user);

    return { success: true, user, verificationSent: true };
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "Παρουσιάστηκε σφάλμα κατά την εγγραφή";
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Το email χρησιμοποιείται ήδη";
        break;
      case "auth/weak-password":
        errorMessage = "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες";
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// ── Σύνδεση χρήστη ──
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Λάθος email ή κωδικός";
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "Δεν βρέθηκε χρήστης με αυτό το email";
        break;
      case "auth/wrong-password":
        errorMessage = "Λάθος κωδικός";
        break;
      case "auth/too-many-requests":
        errorMessage = "Πάρα πολλές προσπάθειες. Δοκίμασε αργότερα";
        break;
      default:
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// ── Αποσύνδεση ──
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ── Επαναποστολή email επαλήθευσης ──
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Δεν βρέθηκε χρήστης" };
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ── Ανανέωση κατάστασης επαλήθευσης (καλείται μετά το κλικ στο link) ──
export const refreshVerificationStatus = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    await reload(user); // ανανεώνει τα δεδομένα του user από το Firebase
    return user.emailVerified;
  } catch (error) {
    console.error("Refresh error:", error);
    return false;
  }
};

// ── Reset password ──
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
