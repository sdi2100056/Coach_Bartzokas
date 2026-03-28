import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import { saveUserProfile } from "./firestore";

// Εγγραφή νέου χρήστη
export const registerUser = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Ενημέρωση προφίλ στο Firebase Auth
    await updateProfile(user, { displayName: name });
    
    // Αποθήκευση επιπλέον πληροφοριών στο Firestore
    await saveUserProfile(user.uid, {
      name: name,
      email: email,
      phone: phone,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, user };
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

// Σύνδεση χρήστη
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
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Αποσύνδεση
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Αποστολή email επαναφοράς κωδικού
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: error.message };
  }
};