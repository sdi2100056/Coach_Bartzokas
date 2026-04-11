// ── pages/ProfilePage.js ──
import { useState, useRef } from "react";
import Icon from "../components/Icon";
import { t } from "../i18n";
import { resendVerificationEmail, refreshVerificationStatus } from "../auth";

const DEFAULT_AVATARS = [
  "👤","🧑‍💼","👩‍💼","🧑‍🔧","👩‍🔧","🧑‍💻","👩‍💻","🧑‍🎨",
  "🧔","👱‍♀️","🧓","👨‍🦱","👩‍🦰","🧑‍🦳","🧕","👲",
];

function ProfilePage({
  profileItems,
  currentUser,
  setEditingProfileId, setEditProfileValue,
  setEditIsEmail, setEditEmailError,
  setShowSupport,
  onToggleLang,
  onLogout,
  lang,
  toggle, darkMode,
}) {
  const [avatar,          setAvatar]          = useState(null);
  const [showAvatarPanel, setShowAvatarPanel] = useState(false);
  const [verifyLoading,   setVerifyLoading]   = useState(false);
  const [verifyMsg,       setVerifyMsg]       = useState("");
  const [isVerified,      setIsVerified]      = useState(currentUser?.emailVerified ?? false);
  const fileInputRef = useRef(null);

  // ── Στείλε ξανά email επαλήθευσης ──
  const handleResendVerification = async () => {
    setVerifyLoading(true);
    setVerifyMsg("");
    const result = await resendVerificationEmail();
    setVerifyLoading(false);
    setVerifyMsg(result.success
      ? "✅ Στάλθηκε! Έλεγξε το email σου."
      : "❌ " + result.error
    );
  };

  // ── Έλεγξε αν επαληθεύτηκε (μετά το κλικ στο link) ──
  const handleCheckVerification = async () => {
    setVerifyLoading(true);
    const verified = await refreshVerificationStatus();
    setIsVerified(verified);
    setVerifyLoading(false);
    setVerifyMsg(verified
      ? "🎉 Το email σου επαληθεύτηκε!"
      : "Δεν έχει επαληθευτεί ακόμα. Έλεγξε το email σου."
    );
  };

  // ── Avatar ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setAvatar(ev.target.result); setShowAvatarPanel(false); };
    reader.readAsDataURL(file);
  };

  const renderAvatar = () => {
    if (!avatar) {
      const initial = currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || "?";
      return <span style={{ fontSize: 36, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff" }}>{initial.toUpperCase()}</span>;
    }
    if (avatar.startsWith("data:")) {
      return <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />;
    }
    return <span style={{ fontSize: 40 }}>{avatar}</span>;
  };

  const handleMenuClick = (item) => {
    if (item.isSupport)  { setShowSupport(true); return; }
    if (item.isLanguage) { onToggleLang();        return; }
    if (item.editable) {
      setEditingProfileId(item.id);
      setEditProfileValue(item.sub);
      setEditIsEmail(item.id === "payments");
      setEditEmailError("");
    }
  };

  const displayName  = currentUser?.displayName || currentUser?.email || "Χρήστης";
  const displayEmail = currentUser?.email || "";

  return (
    <div className="pb-nav">
      <div className="profile-header">
        <button className="theme-toggle" style={{ position: "absolute", top: 16, right: 20 }} onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>

        {/* Avatar */}
        <div style={{ position: "relative", cursor: "pointer", marginBottom: 14 }} onClick={() => setShowAvatarPanel(v => !v)}>
          <div className="profile-ava" style={{ overflow: "hidden" }}>{renderAvatar()}</div>
          <div style={{
            position: "absolute", bottom: 2, right: 2,
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--bg)",
          }}>
            <Icon name="camera" size={13} />
          </div>
        </div>

        <div className="profile-name">{displayName}</div>
        <div className="profile-email">{displayEmail}</div>

        {/* ── Verification Badge ── */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>

          {/* Badge — γεμάτο αν verified, περίγραμμα μόνο αν όχι */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: isVerified ? "rgba(0,201,138,0.15)" : "transparent",
            border: isVerified ? "1px solid var(--accent)" : "1px solid rgba(0,201,138,0.4)",
            borderRadius: 50,
            padding: "6px 14px",
            fontSize: 12,
            color: isVerified ? "var(--accent)" : "rgba(0,201,138,0.6)",
            fontFamily: "'Syne',sans-serif", fontWeight: 700,
            transition: "all .4s ease",
            boxShadow: isVerified ? "0 0 16px rgba(0,201,138,0.3), 0 0 4px rgba(0,201,138,0.15)" : "none",
          }}>
            {/* Shield — γεμάτο με checkmark αν verified */}
            <svg width={13} height={13} viewBox="0 0 24 24"
              fill={isVerified ? "var(--accent)" : "none"}
              stroke={isVerified ? "var(--accent)" : "rgba(0,201,138,0.6)"}
              strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              {isVerified && <polyline points="9 12 11 14 15 10" stroke="#fff" strokeWidth="2.5" fill="none"/>}
            </svg>
            {isVerified ? "✓ Επαληθευμένος χρήστης" : t(lang, "verified")}
          </div>

          {/* Panel επαλήθευσης — εμφανίζεται ΜΟΝΟ αν δεν είναι verified */}
          {!isVerified && (
            <div style={{
              background: "rgba(255,107,53,0.06)",
              border: "1px solid rgba(255,107,53,0.18)",
              borderRadius: 14, padding: "12px 16px",
              width: "100%", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, lineHeight: 1.5 }}>
                📧 Επαλήθευσε το email σου για πλήρη πρόσβαση
              </div>

              {verifyMsg && (
                <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 10 }}>
                  {verifyMsg}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleResendVerification} disabled={verifyLoading} style={{
                  flex: 1, padding: "8px",
                  background: "rgba(255,107,53,0.12)",
                  border: "1px solid rgba(255,107,53,0.25)",
                  borderRadius: 10, color: "var(--accent3)",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11,
                  cursor: verifyLoading ? "not-allowed" : "pointer",
                  opacity: verifyLoading ? 0.6 : 1,
                }}>
                  {verifyLoading ? "..." : "📨 Αποστολή email"}
                </button>

                <button onClick={handleCheckVerification} disabled={verifyLoading} style={{
                  flex: 1, padding: "8px",
                  background: "rgba(0,201,138,0.08)",
                  border: "1px solid rgba(0,201,138,0.2)",
                  borderRadius: 10, color: "var(--accent)",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11,
                  cursor: verifyLoading ? "not-allowed" : "pointer",
                  opacity: verifyLoading ? 0.6 : 1,
                }}>
                  {verifyLoading ? "..." : "✓ Έχω επαληθεύσει"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar Picker */}
        {showAvatarPanel && (
          <div style={{
            marginTop: 16, background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "16px", width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)", animation: "slideUp .25s ease",
          }}>
            <button className="btn btn-primary" style={{ marginBottom: 14, fontSize: 13, padding: "10px 16px" }}
              onClick={() => fileInputRef.current?.click()}>
              <Icon name="upload" size={15} /> {t(lang, "upload_photo")}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>
                {t(lang, "choose_avatar")}
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8, marginBottom: 12 }}>
              {DEFAULT_AVATARS.map(emoji => (
                <div key={emoji} onClick={() => { setAvatar(emoji); setShowAvatarPanel(false); }} style={{
                  width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, borderRadius: 12, cursor: "pointer",
                  background: avatar === emoji ? "rgba(0,201,138,0.15)" : "var(--surface2)",
                  border: avatar === emoji ? "2px solid var(--accent)" : "2px solid transparent", transition: "all .15s",
                }}
                  onMouseEnter={e => { if (avatar !== emoji) e.currentTarget.style.background = "var(--surface3)"; }}
                  onMouseLeave={e => { if (avatar !== emoji) e.currentTarget.style.background = "var(--surface2)"; }}
                >{emoji}</div>
              ))}
            </div>

            <button onClick={() => setShowAvatarPanel(false)} style={{
              width: "100%", padding: "10px", background: "transparent",
              border: "1px solid var(--border)", borderRadius: 12,
              color: "var(--text2)", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>{t(lang, "cancel")}</button>
          </div>
        )}
      </div>

      {/* ── Menu Items ── */}
      {profileItems.map((item) => (
        <div key={item.id} className="menu-item" onClick={() => handleMenuClick(item)}>
          <div className="menu-icon"><Icon name={item.icon} size={18} /></div>
          <div className="menu-text">
            <div className="menu-title">{item.title}</div>
            <div className="menu-sub">{item.sub}</div>
          </div>
          {item.isLanguage ? (
            <div style={{
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 50, padding: "4px 10px", fontSize: 11,
              fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "var(--accent)",
            }}>{lang === "el" ? "EN" : "ΕΛ"}</div>
          ) : (
            <Icon name="arrow" size={16} />
          )}
        </div>
      ))}

      {/* ── Logout ── */}
      <div style={{ padding: "24px 20px", display: "flex", justifyContent: "center" }}>
        <button onClick={onLogout} style={{
          background: "transparent", border: "none", color: "var(--accent3)",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name="close" size={16} /> {t(lang, "logout")}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
