// ── components/ChatbotWidget.js ──
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Είσαι ο βοηθός της εφαρμογής ParkShare — μια πλατφόρμα ενοικίασης θέσεων parking, σαν Airbnb αλλά για parking.

Βοηθάς χρήστες με:
- Πώς κλείνω θέση parking
- Πώς να καταχηρώσω τη δική μου θέση
- Ερωτήσεις για πληρωμές και τιμολόγηση
- Τεχνικά προβλήματα
- Γενικές πληροφορίες για την πλατφόρμα

Απαντάς στα ελληνικά εκτός αν ο χρήστης γράψει αγγλικά. Είσαι φιλικός, σύντομος και χρήσιμος. Μη χρησιμοποιείς markdown formatting (χωρίς **, #, κλπ). Γράφε απλό κείμενο.`;

// ── Προκαθορισμένες απαντήσεις για Quick Replies ──────────────────────────
const PREDEFINED = {
  "Πώς κάνω κράτηση;": `Για να κάνεις κράτηση:

1. Πήγαινε στην Αρχική και βρες μια θέση που σε ενδιαφέρει.
2. Πάτα πάνω στην αγγελία για να δεις τις λεπτομέρειες.
3. Πάτα "Κράτηση τώρα".
4. Συμπλήρωσε ημερομηνία, ώρα, διάρκεια και πινακίδα οχήματος.
5. Επιβεβαίωσε και πλήρωσε.

Μετά την επιβεβαίωση θα λάβεις κωδικό κράτησης και ο ιδιοκτήτης θα επικοινωνήσει μαζί σου για την παράδοση του κλειδιού.`,

  "Πώς βάζω τη θέση μου;": `Για να καταχωρήσεις τη θέση σου:

1. Πάτα "Πρόσθεσε" στο κάτω μενού.
2. Βήμα 1: Βάλε τίτλο, διεύθυνση και τύπο χώρου (γκαράζ, υπαίθριο κλπ).
3. Βήμα 2: Ορίσε τιμή ανά ώρα και ώρες διαθεσιμότητας.
4. Βήμα 3: Επίλεξε τρόπο παράδοσης κλειδιού και βάλε στοιχεία επικοινωνίας.
5. Πάτα "Δημοσίευση".

Η αγγελία σου θα εμφανιστεί αμέσως στον χάρτη και στη λίστα αποτελεσμάτων.`,

  "Πώς πληρώνω;": `Η χρέωση γίνεται ως εξής:

Τιμή = (τιμή/ώρα) × ώρες + 15% προμήθεια πλατφόρμας.

Παράδειγμα: €2/ώρα × 3 ώρες = €6 + €0.90 προμήθεια = €6.90 σύνολο.

Οι πληρωμές γίνονται με κάρτα (Visa, Mastercard) κατά την επιβεβαίωση κράτησης. Δεν χρειάζεται μετρητά. Μπορείς να ακυρώσεις δωρεάν έως 24 ώρες πριν την κράτηση.`,

  "Έχω πρόβλημα με κράτηση": `Αν έχεις πρόβλημα με κράτηση, μπορείς να:

1. Επικοινωνήσεις με τον ιδιοκτήτη μέσω των στοιχείων επικοινωνίας της αγγελίας.
2. Χρησιμοποιήσεις την Υποστήριξη 24/7 από το μενού Προφίλ — η ομάδα μας απαντά εντός 24 ωρών.
3. Για επείγοντα, στείλε email στο support@parkshare.gr.

Διατηρούμε λεπτομερές ιστορικό κρατήσεων οπότε μπορούμε να επαληθεύσουμε οποιαδήποτε κράτηση άμεσα.`,
};

// ── Quick reply buttons ────────────────────────────────────────────────────
const QUICK_REPLIES = Object.keys(PREDEFINED);

export default function ChatbotWidget({ lang = "el" }) {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse,   setPulse]   = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // ── Στέλνει μήνυμα — πρώτα ελέγχει predefined, αλλιώς καλεί API ──────
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMsgs = [...msgs, { role: "user", content: userText }];
    setMsgs(newMsgs);

    // ── Predefined check ──────────────────────────────────────────────
    const predefined = PREDEFINED[userText];
    if (predefined) {
      // Μικρή καθυστέρηση για να φαίνεται φυσικό
      setLoading(true);
      setTimeout(() => {
        setMsgs(prev => [...prev, { role: "assistant", content: predefined }]);
        setLoading(false);
      }, 420);
      return;
    }

    // ── API call για ελεύθερο κείμενο ─────────────────────────────────
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-opus-4-5",
          max_tokens: 1000,
          system:     SYSTEM_PROMPT,
          messages:   newMsgs,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API error:", response.status, errText);
        throw new Error("API error " + response.status);
      }

      const data  = await response.json();
      const reply = data.content?.[0]?.text || "Συγγνώμη, δεν έλαβα απάντηση.";
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMsgs(prev => [
        ...prev,
        { role: "assistant", content: "Σφάλμα σύνδεσης. Δοκίμασε ξανά ή χρησιμοποίησε την Υποστήριξη 24/7 από το Προφίλ." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Εμφανίζει quick replies μόνο όταν δεν υπάρχουν μηνύματα ──────────
  const showQuickReplies = msgs.length === 0;

  return (
    <>
      {/* ── FAB button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 80, right: 18,
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--accent)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)", zIndex: 500,
          transition: "transform .2s",
          transform: open ? "scale(0.92)" : "scale(1)",
        }}
      >
        {pulse && !open && (
          <span style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            border: "2px solid var(--accent)",
            animation: "chatPulse 1.4s ease-out infinite", opacity: 0,
          }} />
        )}
        <span style={{ fontSize: open ? 20 : 22, lineHeight: 1 }}>
          {open ? "✕" : "💬"}
        </span>
      </button>

      {/* ── Chat window ── */}
      <div style={{
        position: "fixed", bottom: 142, right: 12,
        width: "calc(min(360px, 100vw - 24px))", height: 480,
        background: "var(--surface)", borderRadius: 20,
        border: "1px solid var(--border)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
        display: "flex", flexDirection: "column",
        zIndex: 499, overflow: "hidden",
        transition: "opacity .25s, transform .25s",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        pointerEvents: open ? "auto" : "none",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px", borderBottom: "1px solid var(--border)",
          background: "var(--surface2)", flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🅿️</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "var(--text)",
              fontFamily: "'Syne',sans-serif",
            }}>ParkShare AI</div>
            <div style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#4ade80", display: "inline-block",
              }} />
              Online
            </div>
          </div>
          {msgs.length > 0 && (
            <button
              onClick={() => setMsgs([])}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text3)", fontSize: 11, padding: "4px 8px", borderRadius: 8,
              }}
            >
              Καθαρισμός
            </button>
          )}
        </div>

        {/* ── Messages area ── */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "14px 12px",
          display: "flex", flexDirection: "column", gap: 10,
          scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent",
        }}>

          {/* Welcome + Quick Replies */}
          {showQuickReplies && (
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
              <div style={{
                fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4,
                fontFamily: "'Syne',sans-serif",
              }}>
                Γεια σου! Πώς μπορώ να βοηθήσω;
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 16 }}>
                Επίλεξε μια ερώτηση ή γράψε το δικό σου μήνυμα
              </div>

              {/* Quick reply chips */}
              <div style={{
                display: "flex", flexDirection: "column",
                gap: 8, alignItems: "stretch",
                padding: "0 4px",
              }}>
                {QUICK_REPLIES.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "11px 14px",
                      fontSize: 13,
                      color: "var(--text)",
                      cursor: "pointer",
                      transition: "all .15s",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(0,201,138,0.1)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "var(--surface2)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {q === "Πώς κάνω κράτηση;"        ? "🗓" :
                       q === "Πώς βάζω τη θέση μου;"    ? "🏠" :
                       q === "Πώς πληρώνω;"             ? "💳" :
                       q === "Έχω πρόβλημα με κράτηση"  ? "⚠️" : "❓"}
                    </span>
                    <span>{q}</span>
                    <span style={{ marginLeft: "auto", color: "var(--text3)", fontSize: 16 }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              {m.role === "assistant" && (
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}>🅿️</div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "9px 13px",
                borderRadius: m.role === "user"
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                background: m.role === "user" ? "var(--accent)" : "var(--surface2)",
                color: m.role === "user" ? "#fff" : "var(--text)",
                fontSize: 13,
                lineHeight: 1.6,
                wordBreak: "break-word",
                whiteSpace: "pre-line",   // ← διατηρεί line breaks στις predefined απαντήσεις
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>🅿️</div>
              <div style={{
                padding: "10px 14px", background: "var(--surface2)",
                borderRadius: "16px 16px 16px 4px",
                display: "flex", gap: 4, alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "var(--text3)",
                    animation: `chatDot .9s ease-in-out ${i * 0.18}s infinite`,
                    display: "inline-block",
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border)",
          display: "flex", gap: 8, alignItems: "center",
          flexShrink: 0,
          background: "var(--surface2)",
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Γράψε μήνυμα..."
            disabled={loading}
            style={{
              flex: 1, background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20, padding: "9px 14px",
              fontSize: 13, color: "var(--text)",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color .15s",
            }}
            onFocus={e  => e.target.style.borderColor = "var(--accent)"}
            onBlur={e   => e.target.style.borderColor = "var(--border)"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: input.trim() && !loading ? "var(--accent)" : "var(--surface)",
              border: "1px solid var(--border)",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background .2s", flexShrink: 0,
            }}
          >
            <span style={{
              fontSize: 16,
              filter: input.trim() && !loading ? "none" : "opacity(0.4)",
            }}>➤</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes chatPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
