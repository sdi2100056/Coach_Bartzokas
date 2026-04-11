// ── authModal.js — Premium redesign ──
import { useState } from "react";
import { registerUser, loginUser } from "./auth";

const AuthModal = ({ onClose, onSuccess }) => {
  const [isLogin,  setIsLogin]  = useState(true);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = isLogin
      ? await loginUser(email, password)
      : await registerUser(email, password, name, phone);
    setLoading(false);
    if (result.success) { onSuccess(result.user); onClose(); }
    else setError(result.error);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    marginBottom: 12,
    background: focused === field ? "rgba(0,201,138,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focused === field ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12,
    fontSize: 14,
    color: "#f0f4ff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all .2s",
  });

  return (
    <>
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes authOrb1 {
          0%,100% { transform: translate(0,0)       scale(1);   }
          50%     { transform: translate(30px,-20px) scale(1.1); }
        }
        @keyframes authOrb2 {
          0%,100% { transform: translate(0,0)        scale(1);   }
          50%     { transform: translate(-20px,30px) scale(0.9); }
        }
        @keyframes authOrb3 {
          0%,100% { transform: translate(0,0)      scale(1);   }
          33%     { transform: translate(20px,20px) scale(1.1); }
          66%     { transform: translate(-10px,-15px) scale(0.95); }
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-tab { transition: all .25s; }
        .auth-tab:hover { color: var(--accent) !important; }
        .auth-submit:hover:not(:disabled) { 
          filter: brightness(1.1); 
          transform: translateY(-1px); 
          box-shadow: 0 8px 32px rgba(0,201,138,0.4);
        }
        .auth-submit:active:not(:disabled) { transform: translateY(0); }
        .auth-switch:hover { color: var(--accent) !important; }
        .auth-close:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
          animation: "authFadeIn .25s ease",
        }}
      >
        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 420,
          background: "rgba(17,24,39,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          padding: "36px 32px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,201,138,0.08)",
          animation: "authSlideUp .35s cubic-bezier(.16,1,.3,1)",
        }}>

          {/* Background orbs */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,201,138,0.15) 0%, transparent 70%)",
            animation: "authOrb1 8s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,153,255,0.12) 0%, transparent 70%)",
            animation: "authOrb2 10s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,201,138,0.04) 0%, transparent 60%)",
            animation: "authOrb3 12s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="auth-close"
            style={{
              position: "absolute", top: 16, right: 16,
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}
          >✕</button>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, rgba(0,201,138,0.2), rgba(0,153,255,0.15))",
              border: "1px solid rgba(0,201,138,0.3)",
              fontSize: 26, marginBottom: 12,
            }}>🅿️</div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 22,
              fontWeight: 800, letterSpacing: -0.5, color: "#f0f4ff",
            }}>
              Park<span style={{ color: "var(--accent)" }}>Share</span>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: 4,
            marginBottom: 24,
          }}>
            {["Σύνδεση", "Εγγραφή"].map((label, i) => (
              <button
                key={label}
                className="auth-tab"
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: 10, border: "none",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 13,
                  cursor: "pointer",
                  transition: "all .25s",
                  background: (isLogin ? i === 0 : i === 1)
                    ? "linear-gradient(135deg, rgba(0,201,138,0.2), rgba(0,153,255,0.15))"
                    : "transparent",
                  color: (isLogin ? i === 0 : i === 1)
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.4)",
                  boxShadow: (isLogin ? i === 0 : i === 1)
                    ? "0 2px 12px rgba(0,201,138,0.15)"
                    : "none",
                  border: (isLogin ? i === 0 : i === 1)
                    ? "1px solid rgba(0,201,138,0.2)"
                    : "1px solid transparent",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(255,107,53,0.1)",
              border: "1px solid rgba(255,107,53,0.3)",
              color: "#ff6b35",
              padding: "10px 14px",
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Ονοματεπώνυμο"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  required={!isLogin}
                  style={inputStyle("name")}
                />
                <input
                  className="auth-input"
                  type="tel"
                  placeholder="Τηλέφωνο (προαιρετικό)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused("")}
                  style={inputStyle("phone")}
                />
              </>
            )}

            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              required
              style={inputStyle("email")}
            />

            {/* Password with show/hide */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="Κωδικός (τουλάχιστον 6 χαρακτήρες)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                required
                style={{ ...inputStyle("password"), marginBottom: 0, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer", fontSize: 16, padding: 0,
                  transition: "color .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
              style={{
                width: "100%", padding: "14px",
                marginTop: 8,
                background: loading
                  ? "rgba(0,201,138,0.4)"
                  : "linear-gradient(135deg, #00c98a, #00b37a)",
                color: "#fff",
                border: "none", borderRadius: 12,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 4px 20px rgba(0,201,138,0.25)",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin .7s linear infinite",
                    display: "inline-block",
                  }} />
                  Παρακαλώ περιμένετε...
                </>
              ) : (
                isLogin ? "Σύνδεση →" : "Δημιουργία λογαριασμού →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            margin: "20px 0 16px",
          }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'Syne',sans-serif" }}>
              {isLogin ? "ή" : "έχεις ήδη λογαριασμό;"}
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Switch mode */}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="auth-switch"
            style={{
              width: "100%", padding: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, cursor: "pointer",
              transition: "all .2s",
            }}
          >
            {isLogin
              ? "Δεν έχεις λογαριασμό; Εγγράψου"
              : "Έχεις ήδη λογαριασμό; Συνδέσου"}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AuthModal;
