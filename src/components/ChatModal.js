// ── components/ChatModal.js ──
import { useState, useEffect, useRef } from "react";
import { sendMessage, subscribeToMessages, getOrCreateConversation } from "../firestore";

function ChatModal({ booking, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState(null);
  const bottomRef = useRef(null);

  // Δημιουργία/εύρεση conversation και real-time listener
  useEffect(() => {
    let unsubscribe = () => {};
    const init = async () => {
      const id = await getOrCreateConversation(
        booking.id,
        booking.driverUid,
        booking.ownerUid,
        booking.listing || booking.title || "Θέση Parking"
      );
      setConvId(id);
      setLoading(false);
      unsubscribe = subscribeToMessages(id, (msgs) => {
        setMessages(msgs);
      });
    };
    init();
    return () => unsubscribe();
  }, [booking]);

  // Auto-scroll στο τελευταίο μήνυμα
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !convId || sending) return;
    setSending(true);
    await sendMessage(
      convId,
      currentUser.uid,
      currentUser.displayName || currentUser.email,
      text.trim()
    );
    setText("");
    setSending(false);
  };

  const isMe = (msg) => msg.senderUid === currentUser.uid;

  // Όνομα συνομιλητή
  const otherName = currentUser.uid === booking.driverUid
    ? (booking.owner || "Ιδιοκτήτης")
    : (booking.driver || "Οδηγός");

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: "100%", maxWidth: 480,
        height: "75vh",
        background: "var(--bg)",
        borderRadius: "24px 24px 0 0",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
        animation: "slideUp .3s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--surface)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(0,201,138,0.15)",
            border: "1px solid rgba(0,201,138,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 700,
              fontSize: 14, color: "var(--text)",
            }}>{otherName}</div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>
              🅿️ {booking.listing || booking.title || "Θέση Parking"}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--surface2)", border: "none",
            borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text2)", fontSize: 16,
          }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "16px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text2)", marginTop: 40 }}>
              Φόρτωση...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text2)", marginTop: 40, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
              Ξεκίνα τη συνομιλία με τον {otherName}!
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                display: "flex",
                justifyContent: isMe(msg) ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "75%",
                  background: isMe(msg)
                    ? "linear-gradient(135deg, #00c98a, #00a572)"
                    : "var(--surface2)",
                  color: isMe(msg) ? "#fff" : "var(--text)",
                  padding: "10px 14px",
                  borderRadius: isMe(msg)
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  fontSize: 14,
                  lineHeight: 1.4,
                }}>
                  <div>{msg.text}</div>
                  <div style={{
                    fontSize: 10,
                    marginTop: 4,
                    color: isMe(msg) ? "rgba(255,255,255,0.7)" : "var(--text3)",
                    textAlign: "right",
                  }}>{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex", gap: 8,
          background: "var(--surface)",
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Γράψε μήνυμα..."
            style={{
              flex: 1, padding: "12px 16px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 24, fontSize: 14,
              color: "var(--text)", outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button type="submit" disabled={!text.trim() || sending} style={{
            width: 44, height: 44, borderRadius: "50%",
            background: text.trim()
              ? "linear-gradient(135deg, #00c98a, #00a572)"
              : "var(--surface2)",
            border: "none", cursor: text.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, transition: "all .2s",
            flexShrink: 0,
          }}>
            {sending ? "⏳" : "➤"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
