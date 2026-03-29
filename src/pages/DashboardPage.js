// ── pages/DashboardPage.js ──
import Icon from "../components/Icon";
import { t } from "../i18n";

const mockUser = { name: "Χρήστης Demo" };

function DashboardPage({ bookings, listings, toggle, darkMode, lang = "el" }) {

  const totalRevenue = bookings
    .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
    .toFixed(2);

  const totalHours = bookings.reduce((sum, b) => {
    const match = b.time.match(/\((\d+) ώρε/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const avgPrice = listings.length > 0
    ? (listings.reduce((s, l) => s + l.price, 0) / listings.length).toFixed(2)
    : "0";

  // ── Μέση βαθμολογία: υπολογίζεται από τα listing.rating (Feature 3) ──
  const ratedListings = listings.filter(l => l.reviews > 0);
  const avgRating = ratedListings.length > 0
    ? (ratedListings.reduce((s, l) => s + l.rating, 0) / ratedListings.length).toFixed(1)
    : "—";

  const fromLabel = bookings.length === 1
    ? t(lang, "from_bookings")
    : t(lang, "from_bookings_pl");

  return (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">
          {t(lang, "dashboard_title")}{" "}
          <span style={{ color: "var(--accent)" }}>{t(lang, "dashboard_sub")}</span>
        </div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
          {t(lang, "hello")} {mockUser.name.split(" ")[0]} 👋
        </div>

        {/* Revenue card */}
        <div className="revenue-card">
          <div className="rev-label">{t(lang, "total_revenue")}</div>
          <div className="rev-val">€ {totalRevenue}</div>
          <div className="rev-sub">
            {bookings.length === 0
              ? t(lang, "no_bookings_yet")
              : `${t(lang, "hello").replace(",","").trim()} ${bookings.length} ${fromLabel}`}
          </div>
        </div>
      </div>

      {/* Stats grid — τώρα περιλαμβάνει μέση βαθμολογία από πραγματικά δεδομένα */}
      <div className="stats-grid">
        {[
          { val: bookings.length,                              label: t(lang, "stat_bookings") },
          { val: avgRating,                                    label: t(lang, "stat_rating")   },
          { val: totalHours > 0 ? `${totalHours}ω` : "0ω",   label: t(lang, "stat_hours")    },
          { val: listings.length > 0 ? `€${avgPrice}` : "€0",label: t(lang, "stat_price")    },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div style={{ padding: "0 20px" }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          {t(lang, "upcoming")}
        </div>

        {bookings.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)", fontSize: "13px" }}>
            {t(lang, "no_upcoming")}
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
                  {b.status === "active" ? t(lang, "badge_now") : t(lang, "badge_soon")}
                </div>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginTop: 8,
              }}>
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
