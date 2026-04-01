// ── pages/BookingsPage.js ──
import Icon from "../components/Icon";

function BookingsPage({ bookings, toggle, darkMode }) {
  return (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Κρατήσεις<span style={{ color: "var(--accent)" }}>μου</span></div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
          Ιστορικό & ενεργές κρατήσεις
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text2)", fontSize: "14px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
            Δεν έχεις καμία κράτηση ακόμα!<br />
            Βρες μια θέση από την Αρχική για να ξεκινήσεις.
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-top">
                <div>
                  <div className="booking-title">{b.listing}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    #{b.id} · {b.driver}
                  </div>
                </div>
                <div className={`badge badge-${b.status === "active" ? "active" : b.status === "upcoming" ? "upcoming" : "done"}`}>
                  {b.status === "active" ? "🟢 Ενεργή" : b.status === "upcoming" ? "🔵 Επερχόμενη" : "✅ Ολοκλ."}
                </div>
              </div>

              <div style={{ marginBottom: 10, display: "flex", gap: 16, fontSize: 12, color: "var(--text2)", flexWrap: "wrap" }}>
                <span>🚗 {b.plate}</span>
                <span>📅 {b.date}</span>
                <span>⏰ {b.time}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>Σύνολο</div>
                <div className="booking-amount">€{b.amount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
