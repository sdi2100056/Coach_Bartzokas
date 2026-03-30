// ── components/ChatbotWidget.js ──
// Λειτουργεί ΕΝΤΕΛΩΣ ΤΟΠΙΚΑ — δεν χρειάζεται API, server ή internet
import { useState, useRef, useEffect } from "react";

// ── Προκαθορισμένες ερωτήσεις & απαντήσεις ───────────────────────────────
const QA = [
  {
    icon: "🗓",
    q: "Πώς κάνω κράτηση;",
    a: `Για να κάνεις κράτηση:\n\n1. Πήγαινε στην Αρχική και βρες μια θέση.\n2. Πάτα πάνω στην αγγελία για τις λεπτομέρειες.\n3. Πάτα "Κράτηση τώρα".\n4. Συμπλήρωσε ημερομηνία, ώρα, διάρκεια και πινακίδα.\n5. Επιβεβαίωσε την κράτηση.\n\nΟ ιδιοκτήτης θα επικοινωνήσει μαζί σου για το κλειδί.`,
  },
  {
    icon: "🏠",
    q: "Πώς καταχωρώ τη θέση μου;",
    a: `Για να καταχωρήσεις τη θέση σου:\n\n1. Πάτα "Πρόσθεσε" στο κάτω μενού.\n2. Βήμα 1: Τίτλος, διεύθυνση, τύπος χώρου.\n3. Βήμα 2: Τιμή ανά ώρα και ώρες διαθεσιμότητας.\n4. Βήμα 3: Τρόπος παράδοσης κλειδιού και στοιχεία επικοινωνίας.\n5. Πάτα "Δημοσίευση".\n\nΗ αγγελία σου εμφανίζεται αμέσως στη λίστα!`,
  },
  {
    icon: "💳",
    q: "Πώς λειτουργούν οι πληρωμές;",
    a: `Η χρέωση υπολογίζεται ως εξής:\n\nΤιμή = (τιμή/ώρα) × ώρες + 15% προμήθεια πλατφόρμας.\n\nΠαράδειγμα: €2/ώρα × 3 ώρες = €6 + €0.90 = €6.90 σύνολο.\n\nΟι πληρωμές γίνονται με κάρτα (Visa, Mastercard) κατά την επιβεβαίωση. Δεν χρειάζονται μετρητά.`,
  },
  {
    icon: "❌",
    q: "Πώς ακυρώνω κράτηση;",
    a: `Για ακύρωση κράτησης:\n\n1. Πήγαινε στη σελίδα "Κρατήσεις".\n2. Βρες την κράτηση που θέλεις να ακυρώσεις.\n3. Πάτα "Ακύρωση".\n\nΔωρεάν ακύρωση έως 24 ώρες πριν την κράτηση. Μετά τις 24 ώρες ισχύει η πολιτική ακύρωσης του ιδιοκτήτη.`,
  },
  {
    icon: "🔑",
    q: "Πώς παίρνω το κλειδί;",
    a: `Η παράδοση κλειδιού εξαρτάται από τον ιδιοκτήτη:\n\n1. Κλειδοθήκη: ο ιδιοκτήτης σου δίνει κωδικό.\n2. Αυτοπροσώπως: συναντιέστε στο χώρο.\n3. Γείτονας/θυροφύλακας: παράδοση από τρίτο.\n\nΟ τρόπος παράδοσης αναγράφεται στην αγγελία πριν κάνεις κράτηση.`,
  },
  {
    icon: "📊",
    q: "Πώς βλέπω τα έσοδά μου;",
    a: `Τα στατιστικά σου βρίσκονται στο Dashboard:\n\n1. Πάτα "Dashboard" στο κάτω μενού.\n2. Βλέπεις συνολικά έσοδα, αριθμό κρατήσεων και αξιολογήσεις.\n3. Επίσης στο Προφίλ → Στατιστικά για περισσότερες λεπτομέρειες.`,
  },
  {
    icon: "⚠️",
    q: "Έχω πρόβλημα με κράτηση",
    a: `Αν έχεις πρόβλημα με κράτηση:\n\n1. Επικοινώνησε με τον ιδιοκτήτη μέσω των στοιχείων της αγγελίας.\n2. Χρησιμοποίησε την Υποστήριξη 24/7 από το μενού Προφίλ.\n3. Στείλε email στο support@parkshare.gr.\n\nΗ ομάδα μας απαντά εντός 24 ωρών.`,
  },
  {
    icon: "📞",
    q: "Πώς επικοινωνώ με υποστήριξη;",
    a: `Για να επικοινωνήσεις με την υποστήριξη:\n\n1. Πήγαινε στο Προφίλ.\n2. Πάτα "Υποστήριξη 24/7".\n3. Συμπλήρωσε τη φόρμα με την κατηγορία και το μήνυμά σου.\n\nΕναλλακτικά στείλε email: support@parkshare.gr\n\nΑπαντάμε εντός 24 ωρών!`,
  },
  {
    icon: "⭐",
    q: "Πώς αξιολογώ μια θέση;",
    a: `Για να αξιολογήσεις μια θέση:\n\n1. Άνοιξε την αγγελία της θέσης.\n2. Κάνε scroll κάτω στην ενότητα αξιολογήσεων.\n3. Επίλεξε από 1 έως 5 αστέρια.\n\nΟι αξιολογήσεις βοηθούν άλλους χρήστες να βρουν τις καλύτερες θέσεις!`,
  },
  {
    icon: "🔍",
    q: "Πώς ψάχνω θέση parking;",
    a: `Για να βρεις θέση parking:\n\n1. Στην Αρχική, πληκτρολόγησε περιοχή στην αναζήτηση.\n2. Χρησιμοποίησε τα φίλτρα: Κλειστό γκαράζ, Κοντά μου, Αεροδρόμιο.\n3. Πάτα σε μια αγγελία για να δεις όλες τις λεπτομέρειες.\n\nΤα αποτελέσματα ενημερώνονται αυτόματα!`,
  },
];

// ── Fuzzy match: βρίσκει την πιο κοντινή ερώτηση ─────────────────────────
function findBestMatch(input) {
  const txt = input.toLowerCase();
  // Άμεση αντιστοίχιση
  const exact = QA.find(item => item.q.toLowerCase() === txt);
  if (exact) return exact;

  // Keywords για κάθε ερώτηση
  const keywords = [
    { idx: 0,  words: ["κράτηση", "κλείσω", "κλεισω", "book", "κλεινω", "κανω κρατηση"] },
    { idx: 1,  words: ["καταχωρ", "βάλω", "βαλω", "θέση μου", "αγγελια", "δημοσιευ", "προσθεσ"] },
    { idx: 2,  words: ["πληρωμ", "χρεωσ", "τιμη", "κοστ", "ευρω", "καρτα", "πληρων"] },
    { idx: 3,  words: ["ακυρ", "cancel", "διαγραφ", "ακυρωσ"] },
    { idx: 4,  words: ["κλειδ", "παραδοσ", "key", "κλειδοθηκη"] },
    { idx: 5,  words: ["εσοδ", "στατιστ", "dashboard", "κερδ", "χρηματ"] },
    { idx: 6,  words: ["προβλημ", "λαθος", "σφαλμα", "issue", "βοηθ", "problem"] },
    { idx: 7,  words: ["υποστηριξ", "επικοινων", "support", "email", "τηλεφ", "βοηθεια"] },
    { idx: 8,  words: ["αξιολογ", "αστερ", "rating", "review", "βαθμολ"] },
    { idx: 9,  words: ["ψαχν", "αναζητ", "βρω", "search", "φιλτρ", "περιοχ"] },
  ];

  for (const { idx, words } of keywords) {
    if (words.some(w => txt.includes(w))) return QA[idx];
  }

  return null;
}

const FALLBACK = `Δεν βρήκα απάντηση για αυτό. Μπορείς να επικοινωνήσεις με την υποστήριξή μας:\n\n📧 support@parkshare.gr\n\nή μέσω της φόρμας στο Προφίλ → Υποστήριξη 24/7.\n\nΜπορώ να σε βοηθήσω με κάτι άλλο;`;

// ─────────────────────────────────────────────────────────────────────────────

export default function ChatbotWidget({ lang = "el" }) {
  const [open,        setOpen]        = useState(false);
  const [msgs,        setMsgs]        = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [pulse,       setPulse]       = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setShowWelcome(false);

    const newMsgs = [...msgs, { role: "user", content: userText }];
    setMsgs(newMsgs);
    setLoading(true);

    // Προσομοίωση μικρής καθυστέρησης για φυσική αίσθηση
    setTimeout(() => {
      const match = findBestMatch(userText);
      const reply = match
        ? match.a + "\n\nΜπορώ να σε βοηθήσω με κάτι άλλο;"
        : FALLBACK;
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 400);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleClear = () => { setMsgs([]); setShowWelcome(true); };

  return (
    <>
      {/* ── FAB ── */}
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
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.transform = "scale(1)"; }}
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
        width: "calc(min(360px, 100vw - 24px))", height: 520,
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
            width: 38, height: 38, borderRadius: "50%", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🅿️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
              ParkShare Chatbot
            </div>
            <div style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Online — Πάντα εδώ για εσένα
            </div>
          </div>
          {msgs.length > 0 && (
            <button onClick={handleClear} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text3)", fontSize: 11, padding: "4px 8px", borderRadius: 8,
            }}>Καθαρισμός</button>
          )}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "14px 12px",
          display: "flex", flexDirection: "column", gap: 10,
          scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent",
        }}>

          {/* Welcome */}
          {showWelcome && (
            <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>
                Γεια σου! Είμαι ο ParkShare Chatbot
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 16, lineHeight: 1.5 }}>
                Επίλεξε μια ερώτηση ή γράψε το δικό σου μήνυμα!
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "0 2px" }}>
                {QA.map(item => (
                  <button
                    key={item.q}
                    onClick={() => sendMessage(item.q)}
                    style={{
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      borderRadius: 12, padding: "10px 14px",
                      fontSize: 13, color: "var(--text)", cursor: "pointer",
                      transition: "all .15s", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 10,
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
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.q}</span>
                    <span style={{ color: "var(--text3)", fontSize: 16 }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bubbles */}
          {msgs.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: 6,
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}>🅿️</div>
              )}
              <div style={{
                maxWidth: "78%", padding: "9px 13px",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? "var(--accent)" : "var(--surface2)",
                color: m.role === "user" ? "#fff" : "var(--text)",
                fontSize: 13, lineHeight: 1.6,
                wordBreak: "break-word", whiteSpace: "pre-line",
              }}>{m.content}</div>
            </div>
          ))}

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
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "var(--text3)",
                    animation: `chatDot .9s ease-in-out ${i*0.18}s infinite`,
                    display: "inline-block",
                  }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "10px 12px", borderTop: "1px solid var(--border)",
          display: "flex", gap: 8, alignItems: "center",
          flexShrink: 0, background: "var(--surface2)",
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Γράψε το μήνυμά σου..."
            disabled={loading}
            style={{
              flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "9px 14px", fontSize: 13, color: "var(--text)",
              outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color .15s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e  => e.target.style.borderColor = "var(--border)"}
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
            <span style={{ fontSize: 16, filter: input.trim() && !loading ? "none" : "opacity(0.4)" }}>➤</span>
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
