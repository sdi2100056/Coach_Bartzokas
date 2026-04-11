// ── Authcontext.js ──
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // emailVerified διαβάζεται κατευθείαν από το Firebase user object
  const isVerified = user?.emailVerified ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, isVerified }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
