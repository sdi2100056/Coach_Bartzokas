// ── pages/ProfilePage.js ──
import { useState, useRef } from "react";
import Icon from "../components/Icon";
import { t } from "../i18n";

const mockUser = { email: "demo@parkshare.gr", name: "Χρήστης Demo" };

// 16 προεπιλεγμένα avatars
const DEFAULT_AVATARS = [
  "👤","🧑‍💼","👩‍💼","🧑‍🔧","👩‍🔧","🧑‍💻","👩‍💻","🧑‍🎨",
  "🧔","👱‍♀️","🧓","👨‍🦱","👩‍🦰","🧑‍🦳","🧕","👲",
];

function ProfilePage({
  profileItems,
  setEditingProfileId, setEditProfileValue,
  setEditIsEmail, setEditEmailError,
  setShowSupport,
  onToggleLang,
  lang,
  toggle, darkMode,
}) {
  // ── Avatar state ──
  const [avatar,          setAvatar]          = useState(null); // null=initials | emoji string | dataUrl string
  const [showAvatarPanel, setShowAvatarPanel] = useState(false);
  const fileInputRef = useRef(null);

  // ── Photo upload handler ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result); // base64 dataUrl
      setShowAvatarPanel(false);
    };
    reader.readAsDataURL(file);
  };

  // ── Render avatar content ──
  const renderAvatar = () => {
    if (!avatar) {
      // Initials fallback
      return (
        <span style={{ fontSize: 36, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff" }}>
          {mockUser.name.charAt(0)}
        </span>
      );
    }
    if (avatar.startsWith("data:")) {
      // Uploaded photo
      return (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      );
    }
    // Emoji avatar
    return <span style={{ fontSize: 40 }}>{avatar}</span>;
  };

  // ── Menu item click ──
  const handleMenuClick = (item) => {
    if (item.isSupport)  { setShowSupport(true);  return; }
    if (item.isLanguage) { onToggleLang();         return; }
    if (item.editable) {
      setEditingProfileId(item.id);
      setEditProfileValue(item.sub);
      setEditIsEmail(item.id === "payments");
      setEditEmailError("");
    }
  };

  return (
    <div className="pb-nav">

      {/* ── Profile Header ── */}
      <div className="profile-header">
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          style={{ position: "absolute", top: 16, right: 20 }}
          onClick={toggle}
        >
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>

        {/* Avatar — κλικ για αλλαγή */}
        <div
          style={{ position: "relative", cursor: "pointer", marginBottom: 14 }}
          onClick={() => setShowAvatarPanel(v => !v)}
        >
          <div className="profile-ava" style={{ overflow: "hidden" }}>
            {renderAvatar()}
          </div>

          {/* Camera badge */}
          <div style={{
            position: "absolute",
            bottom: 2, right: 2,
            width: 26, height: 26,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--bg)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}>
            <Icon name="camera" size={13} />
          </div>
        </div>

        <div className="profile-name">{mockUser.name}</div>
        <div className="profile-email">{mockUser.email}</div>
        <div className="profile-badge">
          <Icon name="shield" size={13} /> {t(lang, "verified")}
        </div>

        {/* ── Avatar Picker Panel ── */}
        {showAvatarPanel && (
          <div style={{
            marginTop: 16,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "16px",
            width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            animation: "slideUp .25s ease",
          }}>
            {/* Upload button */}
            <button
              className="btn btn-primary"
              style={{ marginBottom: 14, fontSize: 13, padding: "10px 16px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="upload" size={15} /> {t(lang, "upload_photo")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>
                {t(lang, "choose_avatar")}
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Default avatars grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 8,
              marginBottom: 12,
            }}>
              {DEFAULT_AVATARS.map(emoji => (
                <div
                  key={emoji}
                  onClick={() => { setAvatar(emoji); setShowAvatarPanel(false); }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: avatar === emoji ? "rgba(0,201,138,0.15)" : "var(--surface2)",
                    border: avatar === emoji ? "2px solid var(--accent)" : "2px solid transparent",
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { if (avatar !== emoji) e.currentTarget.style.background = "var(--surface3)"; }}
                  onMouseLeave={e => { if (avatar !== emoji) e.currentTarget.style.background = "var(--surface2)"; }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            {/* Cancel */}
            <button
              style={{
                width: "100%", padding: "10px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text2)",
                fontFamily: "'Syne',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={() => setShowAvatarPanel(false)}
            >
              {t(lang, "cancel")}
            </button>
          </div>
        )}
      </div>

      {/* ── Menu Items ── */}
      {profileItems.map((item) => (
        <div
          key={item.id}
          className="menu-item"
          onClick={() => handleMenuClick(item)}
        >
          <div className="menu-icon">
            <Icon name={item.icon} size={18} />
          </div>
          <div className="menu-text">
            <div className="menu-title">{item.title}</div>
            <div className="menu-sub">{item.sub}</div>
          </div>
          {/* Language item shows a toggle indicator */}
          {item.isLanguage ? (
            <div style={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 50,
              padding: "4px 10px",
              fontSize: 11,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              color: "var(--accent)",
            }}>
              {lang === "el" ? "EN" : "ΕΛ"}
            </div>
          ) : (
            <Icon name="arrow" size={16} />
          )}
        </div>
      ))}

      {/* Logout */}
      <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <button style={{
          background: "transparent", border: "none",
          color: "var(--accent3)",
          fontFamily: "'Syne',sans-serif", fontWeight: "700", cursor: "pointer",
        }}>
          {t(lang, "logout")}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
