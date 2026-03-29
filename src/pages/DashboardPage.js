// ── pages/DashboardPage.js ──
import Icon from "../components/Icon";

const mockUser = { name: "Χρήστης Demo" };

function DashboardPage({ bookings, listings, toggle, darkMode }) {
  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2);

  const totalHours = bookings.reduce((sum, b) => {
    const match = b.time.match(/\((\d+) ώρε/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const avgPrice = listings.length > 0
    ? (listings.reduce((s, l) => s + l.price, 0) / listings.length).toFixed(2)
    : "0";

  return (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Dashboard <span style={{ color: "var(--accent)" }}>Ιδ/τη</span></div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
          Γεια σου, {mockUser.name.split(" ")[0]} 👋
        </div>

        {/* Revenue card */}
        <div className="revenue-card">
          <div className="rev-label">Συνολικά Έσοδα</div>
          <div className="rev-val">€ {totalRevenue}</div>
          <div className="rev-sub">
            {bookings.length === 0
              ? "Δεν υπάρχουν κρατήσεις ακόμα"
              : `Από ${bookings.length} κράτηση${bookings.length === 1 ? "" : "εις"}`}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        {[
          { val: bookings.length,                                  label: "Κρατήσεις συνολικά" },
          { val: listings.length > 0 ? "4.9" : "—",               label: "Μέση βαθμολογία" },
          { val: totalHours > 0 ? `${totalHours}ω` : "0ω",        label: "Συνολικές ώρες" },
          { val: listings.length > 0 ? `€${avgPrice}` : "€0",     label: "Μέση τιμή / ώρα" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div style={{ padding: "0 20px" }}>
        <div className="section-title" style={{ marginBottom: 12 }}>📋 Επερχόμενες Κρατήσεις</div>

        {bookings.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)", fontSize: "13px" }}>
            Δεν υπάρχουν νέες κρατήσεις για τις θέσεις σου.
          </div>
        ) : (
          bookings.filter(b => b.status !== "completed").map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-top">
                <div>
                  <div className="booking-title">{b.driver}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    {b.plate} · {b.time}
                  </div>
                </div>
                <div className={`badge badge-${b.status === "active" ? "active" : "upcoming"}`}>
                  {b.status === "active" ? "🟢 Τώρα" : "🔵 Σύντομα"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>📅 {b.date}</div>
                <div className="booking-amount">+€{b.amount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
