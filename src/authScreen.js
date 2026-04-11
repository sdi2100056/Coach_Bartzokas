// ── authScreen.js — Premium full-screen auth ──
import { useState } from "react";
import { registerUser, loginUser, resetPassword } from "./auth";

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin,       setIsLogin]       = useState(true);
  const [isForgot,      setIsForgot]      = useState(false);
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [name,          setName]          = useState("");
  const [phone,         setPhone]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [focused,       setFocused]       = useState("");
  const [resetSent,     setResetSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = isLogin
      ? await loginUser(email, password)
      : await registerUser(email, password, name, phone);
    setLoading(false);
    if (result.success) onAuthSuccess(result.user);
    else setError(result.error);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) { setError("Εισήγαγε το email σου πρώτα"); return; }
    setLoading(true);
    setError("");
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) setResetSent(true);
    else setError(result.error);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    marginBottom: 12,
    background: focused === field ? "rgba(0,201,138,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focused === field ? "#00c98a" : "rgba(255,255,255,0.1)"}`,
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .auth-screen-bg {
          min-height: 100vh;
          background: #0a0f1e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,201,138,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,201,138,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .auth-orb-1 {
          position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,201,138,0.18) 0%, transparent 65%);
          animation: orbFloat1 10s ease-in-out infinite;
        }
        .auth-orb-2 {
          position: absolute; bottom: -80px; left: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,153,255,0.14) 0%, transparent 65%);
          animation: orbFloat2 13s ease-in-out infinite;
        }
        .auth-orb-3 {
          position: absolute; top: 40%; left: 20%;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,201,138,0.06) 0%, transparent 70%);
          animation: orbFloat3 16s ease-in-out infinite;
        }
        @keyframes orbFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,20px) scale(1.1); } }
        @keyframes orbFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-30px) scale(0.9); } }
        @keyframes orbFloat3 { 0%,100% { transform: translate(0,0); } 33% { transform: translate(20px,20px); } 66% { transform: translate(-15px,-10px); } }

        .auth-card {
          width: 100%; max-width: 440px;
          background: rgba(17,24,39,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 44px 36px 36px;
          position: relative; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,201,138,0.06), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cardIn .5s cubic-bezier(.16,1,.3,1);
          backdrop-filter: blur(20px);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-card::before {
          content: "";
          position: absolute; top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,201,138,0.4), transparent);
        }
        .auth-deco { position: absolute; top: -1px; right: 32px; display: flex; gap: 6px; }
        .auth-deco-spot { width: 18px; height: 4px; border-radius: 2px; background: rgba(0,201,138,0.4); }
        .auth-deco-spot:nth-child(2) { background: rgba(0,201,138,0.2); }
        .auth-deco-spot:nth-child(3) { background: rgba(0,201,138,0.1); }

        .auth-tab-btn {
          flex: 1; padding: 10px; border-radius: 10px; border: none;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px;
          cursor: pointer; transition: all .25s;
        }
        .auth-tab-btn:hover { opacity: 0.85; }

        .auth-submit-btn {
          width: 100%; padding: 14px; margin-top: 8px;
          background: linear-gradient(135deg, #00c98a, #00a572);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,201,138,0.3); letter-spacing: 0.2px;
        }
        .auth-submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,201,138,0.45); }
        .auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-switch-btn {
          width: 100%; padding: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .2s;
        }
        .auth-switch-btn:hover { background: rgba(0,201,138,0.06); border-color: rgba(0,201,138,0.2); color: #00c98a; }

        .auth-forgot-btn {
          background: none; border: none;
          color: rgba(0,201,138,0.6);
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          cursor: pointer; transition: color .2s;
          padding: 0; margin-top: 4px;
          text-align: right; width: 100%;
          display: block;
        }
        .auth-forgot-btn:hover { color: #00c98a; }

        .auth-input::placeholder { color: rgba(255,255,255,0.22); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .auth-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: spin .7s linear infinite; display: inline-block;
        }

        .auth-features {
          display: flex; justify-content: center; gap: 20px;
          margin-top: 28px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .auth-feature { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .auth-feature-icon { font-size: 20px; }
        .auth-feature-label {
          font-size: 10px; color: rgba(255,255,255,0.3);
          font-family: 'Syne', sans-serif; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap;
        }
      `}</style>

      <div className="auth-screen-bg">
        <div className="auth-grid" />
        <div className="auth-orb-1" />
        <div className="auth-orb-2" />
        <div className="auth-orb-3" />

        <div className="auth-card">
          <div className="auth-deco">
            <div className="auth-deco-spot" />
            <div className="auth-deco-spot" />
            <div className="auth-deco-spot" />
          </div>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(0,201,138,0.2), rgba(0,153,255,0.15))",
              border: "1px solid rgba(0,201,138,0.3)",
              fontSize: 30, marginBottom: 14,
              boxShadow: "0 8px 32px rgba(0,201,138,0.2)",
            }}>🅿️</div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
              letterSpacing: -1, color: "#f0f4ff", marginBottom: 6,
            }}>
              Park<span style={{ color: "#00c98a" }}>Share</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
              {isForgot ? "Επαναφορά κωδικού" : "Η πλατφόρμα parking για όλους"}
            </div>
          </div>

          {/* ── FORGOT PASSWORD VIEW ── */}
          {isForgot ? (
            <>
              {resetSent ? (
                /* Επιτυχία */
                <div style={{
                  textAlign: "center", padding: "20px 0",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                  <div style={{
                    color: "#00c98a", fontFamily: "'Syne',sans-serif",
                    fontWeight: 700, fontSize: 16, marginBottom: 10,
                  }}>Email στάλθηκε!</div>
                  <div style={{
                    color: "rgba(255,255,255,0.4)", fontSize: 13,
                    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6, marginBottom: 24,
                  }}>
                    Έλεγξε το inbox σου στο <strong style={{ color: "rgba(255,255,255,0.6)" }}>{email}</strong> και ακολούθησε τον σύνδεσμο για να αλλάξεις τον κωδικό σου.
                  </div>
                  <button
                    onClick={() => { setIsForgot(false); setResetSent(false); setError(""); }}
                    className="auth-submit-btn"
                  >
                    ← Επιστροφή στη Σύνδεση
                  </button>
                </div>
              ) : (
                /* Φόρμα reset */
                <>
                  <div style={{
                    background: "rgba(0,153,255,0.07)",
                    border: "1px solid rgba(0,153,255,0.2)",
                    borderRadius: 12, padding: "12px 14px",
                    fontSize: 13, color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6,
                    marginBottom: 20,
                  }}>
                    💡 Εισήγαγε το email σου και θα σου στείλουμε σύνδεσμο για να αλλάξεις τον κωδικό σου.
                  </div>

                  {error && (
                    <div style={{
                      background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)",
                      color: "#ff6b35", padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                      fontSize: 13, fontFamily: "'DM Sans',sans-serif",
                    }}>⚠️ {error}</div>
                  )}

                  <form onSubmit={handleForgotPassword}>
                    <input className="auth-input" type="email"
                      placeholder="Email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                      required style={inputStyle("email")} />

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                      {loading
                        ? <><span className="auth-spinner" /> Αποστολή...</>
                        : "📨 Αποστολή συνδέσμου"
                      }
                    </button>
                  </form>

                  <div style={{ marginTop: 16 }}>
                    <button
                      onClick={() => { setIsForgot(false); setError(""); }}
                      className="auth-switch-btn"
                    >
                      ← Επιστροφή στη Σύνδεση
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            /* ── ΚΑΝΟΝΙΚΟ LOGIN / REGISTER VIEW ── */
            <>
              {/* Tab switcher */}
              <div style={{
                display: "flex",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: 4, marginBottom: 24,
              }}>
                {[{ label: "Σύνδεση", val: true }, { label: "Εγγραφή", val: false }].map(({ label, val }) => (
                  <button key={label} className="auth-tab-btn"
                    onClick={() => { setIsLogin(val); setError(""); }}
                    style={{
                      background: isLogin === val
                        ? "linear-gradient(135deg, rgba(0,201,138,0.2), rgba(0,153,255,0.1))"
                        : "transparent",
                      color: isLogin === val ? "#00c98a" : "rgba(255,255,255,0.35)",
                      border: isLogin === val ? "1px solid rgba(0,201,138,0.2)" : "1px solid transparent",
                      boxShadow: isLogin === val ? "0 2px 12px rgba(0,201,138,0.12)" : "none",
                    }}
                  >{label}</button>
                ))}
              </div>

              {error && (
                <div style={{
                  background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)",
                  color: "#ff6b35", padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                  fontSize: 13, fontFamily: "'DM Sans',sans-serif",
                }}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <input className="auth-input" type="text"
                      placeholder="Ονοματεπώνυμο" value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                      required={!isLogin} style={inputStyle("name")} />
                    <input className="auth-input" type="tel"
                      placeholder="Τηλέφωνο (προαιρετικό)" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                      style={inputStyle("phone")} />
                  </>
                )}

                <input className="auth-input" type="email"
                  placeholder="Email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  required style={inputStyle("email")} />

                <div style={{ position: "relative", marginBottom: 0 }}>
                  <input className="auth-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Κωδικός (τουλάχιστον 6 χαρακτήρες)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                    required
                    style={{ ...inputStyle("password"), marginBottom: 0, paddingRight: 48 }} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "rgba(255,255,255,0.3)",
                      cursor: "pointer", fontSize: 16, transition: "color .2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#00c98a"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                  >{showPass ? "🙈" : "👁"}</button>
                </div>

                {/* Ξέχασες κωδικό — εμφανίζεται μόνο στο login */}
                {isLogin && (
                  <button type="button" className="auth-forgot-btn"
                    onClick={() => { setIsForgot(true); setError(""); setResetSent(false); }}
                  >
                    Ξέχασες τον κωδικό σου;
                  </button>
                )}

                <button type="submit" disabled={loading} className="auth-submit-btn" style={{ marginTop: 16 }}>
                  {loading
                    ? <><span className="auth-spinner" /> Παρακαλώ περιμένετε...</>
                    : (isLogin ? "Σύνδεση →" : "Δημιουργία λογαριασμού →")
                  }
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'Syne',sans-serif" }}>
                  {isLogin ? "ή" : "έχεις ήδη λογαριασμό;"}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="auth-switch-btn">
                {isLogin ? "Δεν έχεις λογαριασμό; Εγγράψου" : "Έχεις ήδη λογαριασμό; Συνδέσου"}
              </button>

              <div className="auth-features">
                {[
                  { icon: "🔒", label: "Ασφαλές" },
                  { icon: "⚡", label: "Γρήγορο" },
                  { icon: "🅿️", label: "Εύκολο" },
                  { icon: "💚", label: "Δωρεάν" },
                ].map(f => (
                  <div key={f.label} className="auth-feature">
                    <div className="auth-feature-icon">{f.icon}</div>
                    <div className="auth-feature-label">{f.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthScreen;
