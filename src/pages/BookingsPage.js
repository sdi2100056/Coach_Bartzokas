// ── pages/BookingsPage.js ──
import { useState } from "react";
import Icon from "../components/Icon";
import ChatModal from "../components/ChatModal";

function BookingsPage({ bookings, currentUser, toggle, darkMode }) {
  const [activeChat, setActiveChat] = useState(null);

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
                    #{b.id?.slice(0,8)} · {b.driver}
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
                <div className="booking-amount">€{b.amount}</div>

                {/* Κουμπί επικοινωνίας */}
                <button
                  onClick={() => setActiveChat(b)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px",
                    background: "rgba(0,201,138,0.1)",
                    border: "1px solid rgba(0,201,138,0.25)",
                    borderRadius: 20,
                    color: "var(--accent)",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 700, fontSize: 12,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,201,138,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,201,138,0.1)"}
                >
                  💬 Επικοινωνία
                </button>
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

export default BookingsPage;
