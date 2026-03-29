// ── pages/ProfilePage.js ──
import Icon from "../components/Icon";

const mockUser = { email: "demo@parkshare.gr", name: "Χρήστης Demo" };

function ProfilePage({
  profileItems,
  setEditingProfileId, setEditProfileValue, setEditIsEmail, setEditEmailError,
  setShowSupport,
  toggle, darkMode,
}) {
  return (
    <div className="pb-nav">
      <div className="profile-header">
        <button className="theme-toggle"
          style={{ position: "absolute", top: 16, right: 20 }}
          onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>

        <div className="profile-ava">{mockUser.name.charAt(0)}</div>
        <div className="profile-name">{mockUser.name}</div>
        <div className="profile-email">{mockUser.email}</div>
        <div className="profile-badge">
          <Icon name="shield" size={13} /> Επαληθευμένος χρήστης
        </div>
      </div>

      {profileItems.map((item) => (
        <div
          key={item.id}
          className="menu-item"
          onClick={() => {
            if (item.isSupport) {
              setShowSupport(true);
            } else if (item.editable) {
              setEditingProfileId(item.id);
              setEditProfileValue(item.sub);
              setEditIsEmail(item.id === "payments");
              setEditEmailError("");
            }
          }}
        >
          <div className="menu-icon"><Icon name={item.icon} size={18} /></div>
          <div className="menu-text">
            <div className="menu-title">{item.title}</div>
            <div className="menu-sub">{item.sub}</div>
          </div>
          <Icon name="arrow" size={16} />
        </div>
      ))}

      <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <button style={{
          background: "transparent", border: "none",
          color: "var(--accent3)",
          fontFamily: "'Syne',sans-serif", fontWeight: "700", cursor: "pointer"
        }}>
          Αποσύνδεση
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
