// ── pages/EditProfilePage.js ──
import Icon from "../components/Icon";

function EditProfilePage({
  item,
  editProfileValue, setEditProfileValue,
  editIsEmail,
  editEmailError, setEditEmailError,
  onSave,
  onClose,
}) {
  if (!item) return null;

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleChange = (e) => {
    setEditProfileValue(e.target.value);
    if (editIsEmail) {
      if (e.target.value && !validateEmail(e.target.value)) {
        setEditEmailError("Το email πρέπει να περιέχει @");
      } else {
        setEditEmailError("");
      }
    }
  };

  return (
    <div className="page" style={{ zIndex: 300 }}>
      {/* Header */}
      <div style={{
        padding: "72px 20px 16px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--border)"
      }}>
        <button className="back-btn"
          style={{ position: "relative", top: 0, left: 0, background: "var(--surface)" }}
          onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
            Επεξεργασία
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{item.title}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div className="form-section">
          <label className="form-label">Νέα καταχώρηση για {item.title}</label>
          <textarea
            className="form-input"
            style={{
              resize: "none",
              minHeight: 80,
              maxHeight: 160,
              overflowY: "auto",
              border: editEmailError ? "1px solid var(--accent3)" : undefined,
            }}
            value={editProfileValue}
            onChange={handleChange}
            autoFocus
            rows={3}
          />
          {editEmailError && (
            <div style={{ fontSize: 11, color: "var(--accent3)", marginTop: 4 }}>
              ⚠ {editEmailError}
            </div>
          )}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onSave}>
          <Icon name="check" size={18} /> Αποθήκευση αλλαγών
        </button>
      </div>
    </div>
  );
}

export default EditProfilePage;
