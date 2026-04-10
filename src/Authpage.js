// src/pages/AuthPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Σελίδα Login / Register με:
//  - Tabs: Σύνδεση | Εγγραφή
//  - Email + Password
//  - Google OAuth
//  - Forgot password
//  - Validation + error messages
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  resetPassword,
} from "../auth/firebase";

// ── Error messages σε ελληνικά ───────────────────────────────────────────────
const FIREBASE_ERRORS = {
  "auth/user-not-found":       "Δεν βρέθηκε λογαριασμός με αυτό το email.",
  "auth/wrong-password":       "Λάθος κωδικός. Δοκίμασε ξανά.",
  "auth/email-already-in-use": "Αυτό το email χρησιμοποιείται ήδη.",
  "auth/weak-password":        "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.",
  "auth/invalid-email":        "Μη έγκυρη μορφή email.",
  "auth/popup-closed-by-user": "Το παράθυρο Google έκλεισε. Δοκίμασε ξανά.",
  "auth/too-many-requests":    "Πολλές αποτυχημένες προσπάθειες. Δοκίμασε αργότερα.",
  "auth/network-request-failed": "Πρόβλημα σύνδεσης. Έλεγξε το internet σου.",
  "auth/invalid-credential":   "Λάθος email ή κωδικός.",
};

function getErrorMsg(code) {
  return FIREBASE_ERRORS[code] || "Κάτι πήγε στραβά. Δοκίμασε ξανά.";
}

// ── Google SVG icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.4)",
      borderTopColor: "#fff", borderRadius: "50%",
      animation: "authSpin .7s linear infinite",
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AuthPage({ darkMode, toggle }) {
  const [tab,      setTab]      = useState("login"); // "login" | "register"
  const [mode,     setMode]     = useState("main");  // "main" | "forgot"

  // Form fields
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  // UI state
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const clearForm = () => {
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    setError(""); setSuccess("");
  };

  const switchTab = (t) => { setTab(t); clearForm(); setMode("main"); };

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    if (!email.includes("@")) { setError("Μη έγκυρο email."); return false; }
    if (password.length < 6)  { setError("Ο κωδικός χρειάζεται τουλάχιστον 6 χαρακτήρες."); return false; }
    if (tab === "register") {
      if (!name.trim())        { setError("Βάλε το όνομά σου."); return false; }
      if (password !== confirm){ setError("Οι κωδικοί δεν ταιριάζουν."); return false; }
    }
    return true;
  };

  // ── Submit Email/Password ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
        // onAuthChange στο AuthContext θα ανανεώσει το user αυτόματα
      } else {
        await registerWithEmail(email, password, name.trim());
      }
    } catch (err) {
      setError(getErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ─────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!email.includes("@")) { setError("Βάλε πρώτα το email σου."); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess("📧 Στάλθηκε email επαναφοράς! Έλεγξε τα εισερχόμενά σου.");
    } catch (err) {
      setError(getErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ───────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 12, padding: "13px 16px",
    fontSize: 14, color: "var(--text)",
    fontFamily: "'DM Sans',sans-serif",
    outline: "none", transition: "border-color .2s",
    boxSizing: "border-box",
  };

  const btnPrimary = {
    width: "100%", padding: "14px",
    background: "var(--accent)", color: "#fff", border: "none",
    borderRadius: 14, fontSize: 15, fontWeight: 700,
    fontFamily: "'Syne',sans-serif", cursor: loading ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    opacity: loading ? 0.8 : 1, transition: "filter .2s",
  };

  const btnGoogle = {
    width: "100%", padding: "13px",
    background: "var(--surface)", color: "var(--text)",
    border: "1px solid var(--border)", borderRadius: 14,
    fontSize: 14, fontWeight: 600, fontFamily: "'Syne',sans-serif",
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    transition: "background .2s",
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "20px",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "var(--surface)",
        borderRadius: 24,
        border: "1px solid var(--border)",
        padding: "32px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>

        {/* Logo + theme toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 24,
            fontWeight: 800, letterSpacing: -1, color: "var(--text)",
          }}>
            Park<span style={{ color: "var(--accent)" }}>Share</span>
          </div>
          <button
            onClick={toggle}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--surface2)", border: "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "var(--text2)", fontSize: 16,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* ── Forgot Password mode ── */}
        {mode === "forgot" ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontSize: 20,
                fontWeight: 800, color: "var(--text)", marginBottom: 6,
              }}>
                Επαναφορά κωδικού
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
                Βάλε το email σου και θα σου στείλουμε σύνδεσμο επαναφοράς.
              </div>
            </div>

            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                style={inputStyle}
                type="email" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={e  => e.target.style.borderColor = "var(--accent)"}
                onBlur={e   => e.target.style.borderColor = "var(--border)"}
              />
              {error   && <div style={{ fontSize: 12, color: "var(--accent3)" }}>⚠ {error}</div>}
              {success && <div style={{ fontSize: 12, color: "var(--accent)",  lineHeight: 1.5 }}>{success}</div>}

              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? <Spinner /> : "Αποστολή email"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("main"); setError(""); setSuccess(""); }}
                style={{ ...btnGoogle, marginTop: 4 }}
              >
                ← Πίσω στη σύνδεση
              </button>
            </form>
          </>

        ) : (
          /* ── Main Login / Register ── */
          <>
            {/* Tabs */}
            <div style={{
              display: "flex", gap: 4,
              background: "var(--surface2)",
              borderRadius: 14, padding: 4, marginBottom: 24,
            }}>
              {[["login","Σύνδεση"], ["register","Εγγραφή"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => switchTab(id)}
                  style={{
                    flex: 1, padding: "10px",
                    borderRadius: 11, border: "none",
                    background: tab === id ? "var(--surface)" : "transparent",
                    color: tab === id ? "var(--text)" : "var(--text2)",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: tab === id ? 700 : 500,
                    fontSize: 14, cursor: "pointer",
                    boxShadow: tab === id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                    transition: "all .2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Greeting */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontSize: 20,
                fontWeight: 800, color: "var(--text)", marginBottom: 4,
              }}>
                {tab === "login" ? "Καλώς ήρθες πίσω 👋" : "Δημιούργησε λογαριασμό 🚗"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                {tab === "login"
                  ? "Συνδέσου για να συνεχίσεις"
                  : "Δωρεάν εγγραφή, χωρίς πιστωτική κάρτα"}
              </div>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={btnGoogle}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}
            >
              <GoogleIcon />
              {tab === "login" ? "Σύνδεση με Google" : "Εγγραφή με Google"}
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              margin: "18px 0",
            }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "'Syne',sans-serif" }}>
                ή με email
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Name — μόνο στην εγγραφή */}
              {tab === "register" && (
                <input
                  style={inputStyle}
                  type="text" placeholder="Ονοματεπώνυμο"
                  value={name} onChange={e => setName(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
              )}

              <input
                style={inputStyle}
                type="email" placeholder="Email"
                value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e  => e.target.style.borderColor = "var(--border)"}
              />

              {/* Password with show/hide toggle */}
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 46 }}
                  type={showPwd ? "text" : "password"}
                  placeholder="Κωδικός (τουλάχιστον 6 χαρακτήρες)"
                  value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer",
                    color: "var(--text3)", fontSize: 16, padding: 0,
                  }}
                >
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>

              {/* Confirm password — μόνο στην εγγραφή */}
              {tab === "register" && (
                <input
                  style={inputStyle}
                  type={showPwd ? "text" : "password"}
                  placeholder="Επανάληψη κωδικού"
                  value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
              )}

              {/* Error message */}
              {error && (
                <div style={{
                  fontSize: 12, color: "var(--accent3)",
                  background: "rgba(255,107,53,0.08)",
                  border: "1px solid rgba(255,107,53,0.25)",
                  borderRadius: 10, padding: "8px 12px",
                  lineHeight: 1.5,
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" style={{ ...btnPrimary, marginTop: 4 }} disabled={loading}>
                {loading
                  ? <Spinner />
                  : tab === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}
              </button>
            </form>

            {/* Forgot password link — μόνο στο login */}
            {tab === "login" && (
              <button
                onClick={() => { setMode("forgot"); setError(""); }}
                style={{
                  marginTop: 12, background: "none", border: "none",
                  color: "var(--accent)", fontSize: 13,
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: "pointer", width: "100%", textAlign: "center",
                }}
              >
                Ξέχασες τον κωδικό σου;
              </button>
            )}

            {/* Switch tab link */}
            <div style={{
              marginTop: 20, textAlign: "center",
              fontSize: 13, color: "var(--text2)",
            }}>
              {tab === "login" ? "Δεν έχεις λογαριασμό; " : "Έχεις ήδη λογαριασμό; "}
              <button
                onClick={() => switchTab(tab === "login" ? "register" : "login")}
                style={{
                  background: "none", border: "none",
                  color: "var(--accent)", fontWeight: 700,
                  cursor: "pointer", fontSize: 13,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {tab === "login" ? "Εγγραφή" : "Σύνδεση"}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
