// ── pages/BookingFormPage.js ──
import Icon from "../components/Icon";

function BookingFormPage({
  listing: l,
  hours, setHours,
  bookDate, setBookDate,
  bookTime, setBookTime,
  plate, setPlate,
  success,
  onConfirm,
  onClose,
  onGoToBookings,
  darkMode,
}) {
  if (success) {
    return (
      <div className="page">
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
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Κράτηση</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>{l.title}</div>
          </div>
        </div>

        {/* Success screen */}
        <div className="success-screen">
          <div className="success-icon"><Icon name="check" size={36} /></div>
          <div className="success-title">Κράτηση επιβεβαιώθηκε! 🎉</div>
          <div className="success-sub">
            Ο ιδιοκτήτης θα επικοινωνήσει μαζί σου για την παράδοση του κλειδιού.
          </div>
          <div className="success-code">
            <div className="code-label">Κωδικός κράτησης</div>
            <div className="code-val">PK-{Math.floor(1000 + Math.random() * 9000)}</div>
          </div>
          <button className="btn btn-primary" onClick={onGoToBookings}>
            Δες τις κρατήσεις μου
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
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
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Κράτηση</div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{l.title}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Date & time */}
        <div className="book-section">
          <div className="book-title"><Icon name="calendar" size={16} /> Ημερομηνία & ώρα</div>
          <div className="book-row">
            <div className="book-field">
              <label>Ημερομηνία</label>
              <input type="date" value={bookDate}
                onChange={e => setBookDate(e.target.value)}
                style={{ colorScheme: darkMode ? "dark" : "light" }} />
            </div>
          </div>
          <div className="book-row">
            <div className="book-field">
              <label>Ώρα έναρξης</label>
              <select value={bookTime} onChange={e => setBookTime(e.target.value)}>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
              </select>
            </div>
            <div className="book-field">
              <label>Διάρκεια</label>
              <select value={hours} onChange={e => setHours(Number(e.target.value))}>
                {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
                  <option key={h} value={h}>{h} ώρ{h === 1 ? "α" : "ες"}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="book-section">
          <div className="book-title"><Icon name="car" size={16} /> Στοιχεία οχήματος</div>
          <div className="book-field">
            <label>Πινακίδα κυκλοφορίας</label>
            <input placeholder="π.χ. ΑΒΓ 1234"
              value={plate}
              onChange={e => setPlate(e.target.value)} />
          </div>
        </div>

        {/* Price summary */}
        <div className="price-summary">
          <div className="price-row">
            <span>€{l.price} × {hours} ώρ{hours === 1 ? "α" : "ες"}</span>
            <span>€{(l.price * hours).toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Προμήθεια πλατφόρμας (15%)</span>
            <span>€{(l.price * hours * 0.15).toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Σύνολο</span>
            <span>€{(l.price * hours * 1.15).toFixed(2)}</span>
          </div>
        </div>

        {/* Key delivery note */}
        <div style={{
          marginTop: 16, marginBottom: 16,
          padding: "12px 16px",
          background: "rgba(0,201,138,0.08)",
          borderRadius: 10,
          border: "1px solid rgba(0,201,138,0.2)",
          display: "flex", gap: 10, alignItems: "center"
        }}>
          <Icon name="key" size={16} />
          <div style={{ fontSize: 12, color: "var(--text2)" }}>
            Το κλειδί παραδίδεται{" "}
            <strong style={{ color: "var(--text)" }}>{l.keyDelivery || "προσωπικά"}</strong>{" "}
            από τον ιδιοκτήτη.
          </div>
        </div>

        <button className="btn btn-primary" onClick={onConfirm}>
          <Icon name="lock" size={18} /> Πληρωμή & Επιβεβαίωση
        </button>

        <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 10 }}>
          🔒 Ασφαλής πληρωμή · Δωρεάν ακύρωση έως 24ω πριν
        </div>
      </div>
    </div>
  );
}

export default BookingFormPage;
