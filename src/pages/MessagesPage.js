// ── pages/MessagesPage.js ──
import { useState, useEffect } from "react";
import { subscribeToConversations, markConversationRead } from "../firestore";
import ChatModal from "../components/ChatModal";
import Icon from "../components/Icon";

function MessagesPage({ currentUser, toggle, darkMode }) {
  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeChat,    setActiveChat]    = useState(null);

  // Real-time listener για conversations
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const unsub = subscribeToConversations(currentUser.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  const getOtherName = (conv) =>
    currentUser.uid === conv.driverUid
      ? (conv.ownerName  || conv.owner  || "Ιδιοκτήτης")
      : (conv.driverName || conv.driver || "Οδηγός");

  const getUnread = (conv) => conv.unread?.[currentUser.uid] || 0;

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Χθες";
    if (diffDays < 7)  return d.toLocaleDateString("el-GR", { weekday: "short" });
    return d.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit" });
  };

  const handleOpenChat = async (conv) => {
    // Μηδενισμός unread πριν ανοίξει το modal
    if (getUnread(conv) > 0) {
      await markConversationRead(conv.id, currentUser.uid);
    }
    setActiveChat(conv);
  };

  // Fake booking object για το ChatModal
  const convToBooking = (conv) => ({
    id:        conv.bookingId || conv.id,
    listing:   conv.listingTitle || "Θέση Parking",
    driverUid: conv.driverUid,
    ownerUid:  conv.ownerUid,
    driver:    conv.driverName || conv.driver || "Οδηγός",
    owner:     conv.ownerName  || conv.owner  || "Ιδιοκτήτης",
  });

  const totalUnread = conversations.reduce((sum, c) => sum + getUnread(c), 0);

  return (
    <div className="pb-nav">
      {/* Top bar */}
      <div className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="logo">
            Μηνύ<span style={{ color: "var(--accent)" }}>ματα</span>
          </div>
          {totalUnread > 0 && (
            <div style={{
              background: "var(--accent)",
              color: "#fff",
              borderRadius: 50,
              padding: "2px 8px",
              fontSize: 12,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
            }}>{totalUnread}</div>
          )}
        </div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
          Συνομιλίες για τις κρατήσεις σου
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
            Φόρτωση συνομιλιών...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text2)", fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
            Δεν έχεις καμία συνομιλία ακόμα!<br />
            Κάνε μια κράτηση και επικοινώνησε με τον ιδιοκτήτη.
          </div>
        ) : (
          conversations.map(conv => {
            const unread    = getUnread(conv);
            const otherName = getOtherName(conv);
            const hasUnread = unread > 0;

            return (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  background: hasUnread ? "rgba(0,201,138,0.06)" : "var(--surface)",
                  border: `1px solid ${hasUnread ? "rgba(0,201,138,0.2)" : "var(--border)"}`,
                  borderRadius: 16,
                  marginBottom: 10,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: hasUnread
                    ? "linear-gradient(135deg, rgba(0,201,138,0.3), rgba(0,153,255,0.2))"
                    : "var(--surface2)",
                  border: hasUnread ? "2px solid var(--accent)" : "2px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                  transition: "all .2s",
                }}>
                  {currentUser.uid === conv.driverUid ? "🏠" : "🚗"}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: hasUnread ? 800 : 600,
                    fontSize: 14,
                    color: "var(--text)",
                    marginBottom: 3,
                  }}>{otherName}</div>
                  <div style={{
                    fontSize: 12,
                    color: hasUnread ? "var(--text)" : "var(--text2)",
                    fontWeight: hasUnread ? 600 : 400,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    🅿️ {conv.listingTitle || "Θέση Parking"}
                  </div>
                  {conv.lastMessage && (
                    <div style={{
                      fontSize: 12,
                      color: hasUnread ? "var(--text2)" : "var(--text3)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      marginTop: 2,
                    }}>
                      {conv.lastSenderUid === currentUser.uid ? "Εσύ: " : ""}{conv.lastMessage}
                    </div>
                  )}
                </div>

                {/* Right side: time + unread badge */}
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "flex-end", gap: 6, flexShrink: 0,
                }}>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {formatTime(conv.lastMessageAt)}
                  </div>
                  {hasUnread ? (
                    <div style={{
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: 50,
                      width: 20, height: 20,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11,
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 800,
                      boxShadow: "0 0 8px rgba(0,201,138,0.5)",
                    }}>
                      {unread > 9 ? "9+" : unread}
                    </div>
                  ) : (
                    <div style={{ width: 20 }} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Modal */}
      {activeChat && currentUser && (
        <ChatModal
          booking={convToBooking(activeChat)}
          currentUser={currentUser}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}

export default MessagesPage;
