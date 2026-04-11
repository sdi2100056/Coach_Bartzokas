// ── pages/DashboardPage.js ──
import { useState } from "react";
import Icon from "../components/Icon";
import { t } from "../i18n";
import ChatModal from "../components/ChatModal";

function DashboardPage({ bookings, listings, currentUser, toggle, darkMode, lang = "el" }) {
  const [activeChat, setActiveChat] = useState(null);

  const totalRevenue = bookings
    .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0)
    .toFixed(2);

  const totalHours = bookings.reduce((sum, b) => {
    const match = b.time?.match(/\((\d+) ώρε/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const avgPrice = listings.length > 0
    ? (listings.reduce((s, l) => s + l.price, 0) / listings.length).toFixed(2)
    : "0";

  const ratedListings = listings.filter(l => l.reviews > 0);
  const avgRating = ratedListings.length > 0
    ? (ratedListings.reduce((s, l) => s + l.rating, 0) / ratedListings.length).toFixed(1)
    : "—";

  const displayName = currentUser?.displayName || currentUser?.email || "Χρήστης";

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
          {t(lang, "hello")} {displayName.split(" ")[0]} 👋
        </div>

        {/* Revenue card */}
        <div className="revenue-card">
          <div className="rev-label">{t(lang, "total_revenue")}</div>
          <div className="rev-val">€ {totalRevenue}</div>
          <div className="rev-sub">
            {bookings.length === 0
              ? t(lang, "no_bookings_yet")
              : `${bookings.length} κρατήσεις συνολικά`}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        {[
          { val: bookings.length,                             label: t(lang, "stat_bookings") },
          { val: avgRating,                                   label: t(lang, "stat_rating")   },
          { val: totalHours > 0 ? `${totalHours}ω` : "0ω",  label: t(lang, "stat_hours")    },
          { val: listings.length > 0 ? `€${avgPrice}` : "€0", label: t(lang, "stat_price")  },
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="booking-amount">+€{b.amount}</div>

                  {/* Κουμπί επικοινωνίας για τον ιδιοκτήτη */}
                  <button
                    onClick={() => setActiveChat(b)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 12px",
                      background: "rgba(0,201,138,0.1)",
                      border: "1px solid rgba(0,201,138,0.25)",
                      borderRadius: 20,
                      color: "var(--accent)",
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700, fontSize: 11,
                      cursor: "pointer", transition: "all .2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,201,138,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,201,138,0.1)"}
                  >
                    💬 Επικοινωνία
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Modal */}
      {activeChat && currentUser && (
        <ChatModal
          booking={activeChat}
          currentUser={currentUser}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
