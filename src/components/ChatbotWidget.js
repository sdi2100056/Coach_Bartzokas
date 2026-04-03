// ── components/ChatbotWidget.js ──
// Λειτουργεί ΕΝΤΕΛΩΣ ΤΟΠΙΚΑ — δεν χρειάζεται API, server ή internet
import { useState, useRef, useEffect } from "react";

// ── Όλες οι ερωτήσεις & απαντήσεις ──────────────────────────────────────
const QA = [
  // ── ΚΡΑΤΗΣΕΙΣ ──
  {
    icon: "🗓", category: "Κρατήσεις",
    q: "Πώς κάνω κράτηση;",
    a: `Για να κάνεις κράτηση:\n\n1. Πήγαινε στην Αρχική και βρες μια θέση.\n2. Πάτα πάνω στην αγγελία για τις λεπτομέρειες.\n3. Πάτα "Κράτηση τώρα".\n4. Συμπλήρωσε ημερομηνία, ώρα, διάρκεια και πινακίδα.\n5. Επιβεβαίωσε την κράτηση.\n\nΟ ιδιοκτήτης θα επικοινωνήσει μαζί σου για το κλειδί.`,
  },
  {
    icon: "❌", category: "Κρατήσεις",
    q: "Πώς ακυρώνω κράτηση;",
    a: `Για ακύρωση κράτησης:\n\n1. Πήγαινε στη σελίδα "Κρατήσεις".\n2. Βρες την κράτηση που θέλεις να ακυρώσεις.\n3. Πάτα "Ακύρωση".\n\nΔωρεάν ακύρωση έως 24 ώρες πριν. Μετά τις 24 ώρες ισχύει η πολιτική ακύρωσης του ιδιοκτήτη.`,
  },
  {
    icon: "📋", category: "Κρατήσεις",
    q: "Πού βλέπω τις κρατήσεις μου;",
    a: `Τις κρατήσεις σου τις βρίσκεις:\n\n1. Πάτα "Κρατήσεις" στο κάτω μενού.\n2. Βλέπεις upcoming, ενεργές και παλιές κρατήσεις.\n3. Κάθε κράτηση έχει κωδικό, ημερομηνία, ώρα και ποσό.\n\nΜπορείς να ακυρώσεις upcoming κρατήσεις από εκεί.`,
  },
  {
    icon: "🔄", category: "Κρατήσεις",
    q: "Μπορώ να τροποποιήσω κράτηση;",
    a: `Αυτή τη στιγμή δεν υπάρχει δυνατότητα άμεσης τροποποίησης.\n\nΗ λύση είναι:\n1. Ακύρωσε την υπάρχουσα κράτηση.\n2. Κάνε νέα κράτηση με τα σωστά στοιχεία.\n\nΑν χρειαστείς βοήθεια επικοινώνησε μαζί μας στο support@parkshare.gr`,
  },

  // ── ΘΕΣΕΙΣ / ΑΓΓΕΛΙΕΣ ──
  {
    icon: "🏠", category: "Αγγελίες",
    q: "Πώς καταχωρώ τη θέση μου;",
    a: `Για να καταχωρήσεις τη θέση σου:\n\n1. Πάτα "Πρόσθεσε" στο κάτω μενού.\n2. Βήμα 1: Τίτλος, διεύθυνση, τύπος χώρου.\n3. Βήμα 2: Τιμή ανά ώρα και ώρες διαθεσιμότητας.\n4. Βήμα 3: Τρόπος παράδοσης κλειδιού και στοιχεία επικοινωνίας.\n5. Πάτα "Δημοσίευση".\n\nΗ αγγελία σου εμφανίζεται αμέσως στη λίστα!`,
  },
  {
    icon: "✏️", category: "Αγγελίες",
    q: "Πώς επεξεργάζομαι την αγγελία μου;",
    a: `Για να επεξεργαστείς την αγγελία σου:\n\n1. Πήγαινε στο Dashboard.\n2. Βρες την αγγελία σου στη λίστα.\n3. Πάτα το εικονίδιο επεξεργασίας.\n4. Άλλαξε ό,τι θέλεις και αποθήκευσε.\n\nΟι αλλαγές εμφανίζονται αμέσως.`,
  },
  {
    icon: "🔍", category: "Αγγελίες",
    q: "Πώς ψάχνω θέση parking;",
    a: `Για να βρεις θέση parking:\n\n1. Στην Αρχική, πληκτρολόγησε περιοχή στην αναζήτηση.\n2. Χρησιμοποίησε τα φίλτρα: Κλειστό γκαράζ, Κοντά μου, Αεροδρόμιο.\n3. Πάτα σε μια αγγελία για να δεις όλες τις λεπτομέρειες.\n\nΤα αποτελέσματα ενημερώνονται αυτόματα!`,
  },
  {
    icon: "📍", category: "Αγγελίες",
    q: "Τι τύποι θέσεων υπάρχουν;",
    a: `Η πλατφόρμα υποστηρίζει τους εξής τύπους:\n\n1. Κλειστό γκαράζ — στεγασμένο, ασφαλές.\n2. Υπόγειο parking — συχνά σε κτήρια.\n3. Υπαίθριος χώρος — open air.\n4. Αυλή — ιδιωτικός χώρος.\n\nΚάθε τύπος έχει διαφορετικές ανέσεις και τιμές.`,
  },

  // ── ΠΛΗΡΩΜΕΣ ──
  {
    icon: "💳", category: "Πληρωμές",
    q: "Πώς λειτουργούν οι πληρωμές;",
    a: `Η χρέωση υπολογίζεται ως εξής:\n\nΤιμή = (τιμή/ώρα) × ώρες + 15% προμήθεια.\n\nΠαράδειγμα: €2/ώρα × 3 ώρες = €6 + €0.90 = €6.90 σύνολο.\n\nΟι πληρωμές γίνονται με κάρτα (Visa, Mastercard) κατά την επιβεβαίωση. Δεν χρειάζονται μετρητά.`,
  },
  {
    icon: "💰", category: "Πληρωμές",
    q: "Πότε πληρώνομαι ως ιδιοκτήτης;",
    a: `Ως ιδιοκτήτης λαμβάνεις:\n\n1. Τα έσοδα μετά την ολοκλήρωση κάθε κράτησης.\n2. Η πληρωμή γίνεται στον τραπεζικό λογαριασμό που έχεις δηλώσει.\n3. Χρόνος επεξεργασίας: 2-3 εργάσιμες μέρες.\n\nΤα συνολικά έσοδά σου φαίνονται στο Dashboard.`,
  },
  {
    icon: "🔖", category: "Πληρωμές",
    q: "Υπάρχει χρέωση για εγγραφή;",
    a: `Η εγγραφή στο ParkShare είναι εντελώς δωρεάν!\n\nΧρεώνεται μόνο:\n1. 15% προμήθεια πλατφόρμας επί κάθε κράτησης.\n2. Δεν υπάρχει συνδρομή ή μηνιαία χρέωση.\n\nΠληρώνεις μόνο όταν χρησιμοποιείς την υπηρεσία.`,
  },
  {
    icon: "↩️", category: "Πληρωμές",
    q: "Πώς γίνεται η επιστροφή χρημάτων;",
    a: `Η επιστροφή χρημάτων γίνεται:\n\n1. Αυτόματα σε ακυρώσεις εντός 24 ωρών.\n2. Εντός 5-7 εργάσιμων ημερών στην κάρτα σου.\n3. Για εξαιρετικές περιπτώσεις επικοινώνησε μαζί μας.\n\n📧 support@parkshare.gr`,
  },

  // ── ΚΛΕΙΔΙ & ΠΑΡΑΔΟΣΗ ──
  {
    icon: "🔑", category: "Κλειδί",
    q: "Πώς παίρνω το κλειδί;",
    a: `Η παράδοση κλειδιού εξαρτάται από τον ιδιοκτήτη:\n\n1. Κλειδοθήκη: ο ιδιοκτήτης σου δίνει κωδικό.\n2. Αυτοπροσώπως: συναντιέστε στο χώρο.\n3. Γείτονας/θυροφύλακας: παράδοση από τρίτο.\n\nΟ τρόπος παράδοσης αναγράφεται στην αγγελία πριν κάνεις κράτηση.`,
  },
  {
    icon: "🚗", category: "Κλειδί",
    q: "Τι γίνεται αν δεν βρω τη θέση;",
    a: `Αν δεν μπορείς να βρεις τη θέση:\n\n1. Επικοινώνησε άμεσα με τον ιδιοκτήτη (τηλέφωνο στην αγγελία).\n2. Αν δεν απαντά, επικοινώνησε με την υποστήριξή μας.\n3. Στείλε email: support@parkshare.gr\n\nΔιαθέτουμε υποστήριξη 24/7 για επείγοντα.`,
  },

  // ── ΑΞΙΟΛΟΓΗΣΕΙΣ ──
  {
    icon: "⭐", category: "Αξιολογήσεις",
    q: "Πώς αξιολογώ μια θέση;",
    a: `Για να αξιολογήσεις μια θέση:\n\n1. Άνοιξε την αγγελία της θέσης.\n2. Κάνε scroll κάτω στην ενότητα αξιολογήσεων.\n3. Επίλεξε από 1 έως 5 αστέρια.\n\nΟι αξιολογήσεις βοηθούν άλλους χρήστες να βρουν τις καλύτερες θέσεις!`,
  },
  {
    icon: "📝", category: "Αξιολογήσεις",
    q: "Μπορώ να αλλάξω αξιολόγηση;",
    a: `Ναι! Μπορείς να αλλάξεις αξιολόγηση:\n\n1. Άνοιξε ξανά την αγγελία.\n2. Πάτα πάνω στα αστέρια.\n3. Επίλεξε νέα βαθμολογία.\n\nΟ μέσος όρος ενημερώνεται αυτόματα.`,
  },

  // ── DASHBOARD & ΣΤΑΤΙΣΤΙΚΑ ──
  {
    icon: "📊", category: "Dashboard",
    q: "Πώς βλέπω τα έσοδά μου;",
    a: `Τα στατιστικά σου βρίσκονται στο Dashboard:\n\n1. Πάτα "Dashboard" στο κάτω μενού.\n2. Βλέπεις συνολικά έσοδα, αριθμό κρατήσεων και αξιολογήσεις.\n3. Στο Προφίλ → Στατιστικά για περισσότερες λεπτομέρειες.`,
  },
  {
    icon: "📈", category: "Dashboard",
    q: "Πώς αυξάνω τις κρατήσεις μου;",
    a: `Συμβουλές για περισσότερες κρατήσεις:\n\n1. Βάλε σαφή φωτογραφία/emoji στην αγγελία.\n2. Γράψε λεπτομερή περιγραφή με όλα τα features.\n3. Ορίσε ανταγωνιστική τιμή για την περιοχή σου.\n4. Απάντα γρήγορα στους ενδιαφερόμενους.\n5. Διατήρησε υψηλή βαθμολογία με καλή εξυπηρέτηση.`,
  },

  // ── ΠΡΟΦΙΛ & ΛΟΓΑΡΙΑΣΜΟΣ ──
  {
    icon: "👤", category: "Προφίλ",
    q: "Πώς αλλάζω τα στοιχεία μου;",
    a: `Για να αλλάξεις τα στοιχεία σου:\n\n1. Πήγαινε στο Προφίλ (κάτω δεξιά).\n2. Πάτα στο πεδίο που θέλεις να αλλάξεις (π.χ. όχημα, email).\n3. Επεξεργάσου και πάτα "Αποθήκευση".\n\nΑλλαγές αποθηκεύονται αμέσως.`,
  },
  {
    icon: "🚗", category: "Προφίλ",
    q: "Πώς προσθέτω όχημα;",
    a: `Για να προσθέσεις όχημα:\n\n1. Πήγαινε στο Προφίλ.\n2. Πάτα "Τα οχήματά μου".\n3. Πάτα επεξεργασία και πρόσθεσε πινακίδα και μοντέλο.\n4. Αποθήκευσε.\n\nΤα στοιχεία του οχήματος θα συμπληρώνονται αυτόματα στις κρατήσεις.`,
  },
  {
    icon: "🌐", category: "Προφίλ",
    q: "Πώς αλλάζω γλώσσα;",
    a: `Για να αλλάξεις γλώσσα:\n\n1. Πήγαινε στο Προφίλ.\n2. Κάνε scroll κάτω και πάτα "Γλώσσα / Language".\n3. Εναλλάσσεται αυτόματα μεταξύ Ελληνικών και Αγγλικών.\n\nΌλη η εφαρμογή αλλάζει γλώσσα αμέσως!`,
  },

  // ── ΑΣΦΑΛΕΙΑ ──
  {
    icon: "🛡️", category: "Ασφάλεια",
    q: "Είναι ασφαλής η εφαρμογή;",
    a: `Το ParkShare διασφαλίζει:\n\n1. Κρυπτογραφημένες συναλλαγές (SSL).\n2. Επαληθευμένοι ιδιοκτήτες θέσεων.\n3. Ιστορικό κρατήσεων για κάθε διένεξη.\n4. Υποστήριξη 24/7 για οποιοδήποτε πρόβλημα.\n\nΤα στοιχεία σου προστατεύονται πλήρως.`,
  },
  {
    icon: "🔒", category: "Ασφάλεια",
    q: "Τι γίνεται αν κλαπεί το αυτοκίνητό μου;",
    a: `Σε περίπτωση κλοπής:\n\n1. Επικοινώνησε αμέσως με την αστυνομία.\n2. Ειδοποίησε τον ιδιοκτήτη της θέσης.\n3. Επικοινώνησε με εμάς: support@parkshare.gr\n\nΣυνιστούμε να έχεις ασφαλιστική κάλυψη για το όχημά σου. Μπορείς να τη διαχειριστείς από Προφίλ → Ασφαλιστική κάλυψη.`,
  },

  // ── ΥΠΟΣΤΗΡΙΞΗ ──
  {
    icon: "📞", category: "Υποστήριξη",
    q: "Πώς επικοινωνώ με υποστήριξη;",
    a: `Για να επικοινωνήσεις με την υποστήριξη:\n\n1. Πήγαινε στο Προφίλ.\n2. Πάτα "Υποστήριξη 24/7".\n3. Συμπλήρωσε τη φόρμα.\n\nΕναλλακτικά: 📧 support@parkshare.gr\n\nΑπαντάμε εντός 24 ωρών!`,
  },
  {
    icon: "⚠️", category: "Υποστήριξη",
    q: "Έχω πρόβλημα με κράτηση",
    a: `Αν έχεις πρόβλημα με κράτηση:\n\n1. Επικοινώνησε με τον ιδιοκτήτη μέσω των στοιχείων της αγγελίας.\n2. Χρησιμοποίησε την Υποστήριξη 24/7 από το μενού Προφίλ.\n3. Στείλε email: support@parkshare.gr\n\nΗ ομάδα μας απαντά εντός 24 ωρών.`,
  },
  {
    icon: "🐛", category: "Υποστήριξη",
    q: "Βρήκα τεχνικό πρόβλημα",
    a: `Ευχαριστούμε που μας το αναφέρεις!\n\nΓια να αναφέρεις τεχνικό πρόβλημα:\n\n1. Πήγαινε στο Προφίλ → Υποστήριξη 24/7.\n2. Επίλεξε κατηγορία "Τεχνικό πρόβλημα".\n3. Περίγραψε τι συνέβη και σε ποια σελίδα.\n\nΗ ομάδα ανάπτυξης θα το διορθώσει το συντομότερο!`,
  },
];

// ── Keywords για fuzzy match ──────────────────────────────────────────────
const KEYWORDS = [
  { idx: 0,  words: ["κρατηση", "κλεισω", "κλεινω", "book", "κανω κρατηση", "νεα κρατηση"] },
  { idx: 1,  words: ["ακυρ", "cancel", "διαγραφ"] },
  { idx: 2,  words: ["κρατησεις μου", "δω κρατησεις", "ιστορικο", "upcoming"] },
  { idx: 3,  words: ["τροποποι", "αλλαξω κρατηση", "μετατρεψ"] },
  { idx: 4,  words: ["καταχωρ", "βαλω θεση", "αγγελια", "δημοσιευ", "προσθεσ", "νοικιασω"] },
  { idx: 5,  words: ["επεξεργ", "αλλαξω αγγελια", "edit"] },
  { idx: 6,  words: ["ψαχν", "αναζητ", "βρω θεση", "search", "φιλτρ"] },
  { idx: 7,  words: ["τυπ", "ειδ", "κλειστο", "υπαιθριο", "υπογειο", "αυλη"] },
  { idx: 8,  words: ["πληρωμ", "χρεωσ", "τιμη", "κοστ", "καρτα", "πληρων"] },
  { idx: 9,  words: ["εσοδ", "πληρωθ", "κερδ", "ιδιοκτητης πληρωμη"] },
  { idx: 10, words: ["εγγραφ", "συνδρομ", "δωρεαν", "κοστιζει η εγγραφη"] },
  { idx: 11, words: ["επιστροφ", "refund", "χρηματ πισω"] },
  { idx: 12, words: ["κλειδ", "παραδοσ", "key", "κλειδοθηκη"] },
  { idx: 13, words: ["δεν βρ", "χαθηκ", "δεν υπαρχ", "λαθος θεση"] },
  { idx: 14, words: ["αξιολογ", "αστερ", "rating", "review", "βαθμολ"] },
  { idx: 15, words: ["αλλαξω αξιολογ", "αλλαγη βαθμολ"] },
  { idx: 16, words: ["dashboard", "εσοδα", "στατιστ", "κερδη"] },
  { idx: 17, words: ["αυξ", "περισσοτερ", "κρατησεις", "tips", "συμβουλ"] },
  { idx: 18, words: ["στοιχεια μου", "αλλαξω προφιλ", "ενημερωσ"] },
  { idx: 19, words: ["οχημα", "αυτοκινητο", "πινακιδ", "vehicle"] },
  { idx: 20, words: ["γλωσσ", "language", "αγγλικ", "ελληνικ"] },
  { idx: 21, words: ["ασφαλ", "safe", "security", "προστασ"] },
  { idx: 22, words: ["κλοπ", "κλεψ", "εκλαψ", "χαθηκε αυτοκινητο"] },
  { idx: 23, words: ["υποστηριξ", "επικοινων", "support", "email", "βοηθεια", "contact"] },
  { idx: 24, words: ["προβλημ", "issue", "λαθος", "σφαλμα"] },
  { idx: 25, words: ["bug", "τεχνικ", "crash", "παγωσε", "δεν λειτουργ"] },
];

function findBestMatch(input) {
  const txt = input.toLowerCase()
    .replace(/[άα]/g,"α").replace(/[έε]/g,"ε").replace(/[ήηι]/g,"η")
    .replace(/[όο]/g,"ο").replace(/[ύυ]/g,"υ").replace(/[ώω]/g,"ω")
    .replace(/[ΐ]/g,"ι").replace(/[ΰ]/g,"υ");

  const exact = QA.find(item => item.q.toLowerCase() === input.toLowerCase());
  if (exact) return exact;

  for (const { idx, words } of KEYWORDS) {
    if (words.some(w => txt.includes(w))) return QA[idx];
  }
  return null;
}

const FALLBACK = `Δεν βρήκα απάντηση γι' αυτό. Μπορείς να επικοινωνήσεις με την υποστήριξή μας:\n\n📧 support@parkshare.gr\nή Προφίλ → Υποστήριξη 24/7`;

// ── Ομαδοποίηση ερωτήσεων ανά κατηγορία ─────────────────────────────────
const CATEGORIES = [...new Set(QA.map(q => q.category))];

// ─────────────────────────────────────────────────────────────────────────────

export default function ChatbotWidget({ lang = "el" }) {
  const [open,         setOpen]         = useState(false);
  const [msgs,         setMsgs]         = useState([]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [pulse,        setPulse]        = useState(true);
  const [screen,       setScreen]       = useState("welcome"); // "welcome" | "chat" | "followup" | "categories"
  const [activeCategory, setActiveCategory] = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, screen]);

  useEffect(() => {
    if (open && screen === "chat") setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, screen]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setScreen("chat");

    const newMsgs = [...msgs, { role: "user", content: userText }];
    setMsgs(newMsgs);
    setLoading(true);

    setTimeout(() => {
      const match = findBestMatch(userText);
      const reply = match ? match.a : FALLBACK;
      setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
      // Μετά από κάθε απάντηση → followup screen
      setTimeout(() => setScreen("followup"), 600);
    }, 420);
  };

  const handleClear = () => {
    setMsgs([]);
    setScreen("welcome");
    setActiveCategory(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Κουμπί στυλ ──────────────────────────────────────────────────────
  const chipStyle = (accent = false) => ({
    background: accent ? "var(--accent)" : "var(--surface2)",
    border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 12, padding: "11px 14px",
    fontSize: 13, color: accent ? "#000" : "var(--text)",
    cursor: "pointer", transition: "all .15s", textAlign: "left",
    display: "flex", alignItems: "center", gap: 10,
    fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700,
    width: "100%",
  });

  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 80, right: 18,
          width: 54, height: 54, borderRadius: "50%",
          background: "var(--accent)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,229,160,0.35)", zIndex: 500,
          transition: "transform .2s",
          transform: open ? "scale(0.92)" : "scale(1)",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.transform = "scale(1)"; }}
      >
        {pulse && !open && (
          <span style={{
            position: "absolute", inset: -5, borderRadius: "50%",
            border: "2px solid var(--accent)",
            animation: "chatPulse 1.4s ease-out infinite", opacity: 0,
          }} />
        )}
        <span style={{ fontSize: open ? 20 : 24, lineHeight: 1, color: "#000" }}>
          {open ? "✕" : "💬"}
        </span>
      </button>

      {/* ── Chat window ── */}
      <div style={{
        position: "fixed", bottom: 145, right: 12,
        width: "calc(min(370px, 100vw - 24px))",
        height: screen === "welcome" ? "auto" : 540,
        maxHeight: "calc(100vh - 170px)",
        background: "var(--surface)", borderRadius: 22,
        border: "1px solid var(--border2)",
        boxShadow: "0 16px 56px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
        zIndex: 499, overflow: "hidden",
        transition: "opacity .25s, transform .25s, height .3s",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
        pointerEvents: open ? "auto" : "none",
      }}>

        {/* ── Header ── */}
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
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "'Cabinet Grotesk',sans-serif" }}>
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
              fontFamily: "'Cabinet Grotesk',sans-serif",
            }}>Νέα συνομιλία</button>
          )}
        </div>

        {/* ── WELCOME SCREEN ── */}
        {screen === "welcome" && (
          <div style={{ padding: "20px 16px 20px", overflowY: "auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 38, marginBottom: 8 }}>👋</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", fontFamily: "'Cabinet Grotesk',sans-serif", letterSpacing: "-.3px" }}>
                Γεια σου! Είμαι ο ParkShare Chatbot
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 5, lineHeight: 1.5 }}>
                Πώς μπορώ να σε βοηθήσω σήμερα;
              </div>
            </div>

            {/* Κατηγορίες */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CATEGORIES.map(cat => {
                const items = QA.filter(q => q.category === cat);
                const firstIcon = items[0]?.icon;
                return (
                  <button key={cat}
                    onClick={() => { setActiveCategory(cat); setScreen("categories"); }}
                    style={chipStyle()}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
                  >
                    <span style={{ fontSize: 18 }}>{firstIcon}</span>
                    <span style={{ flex: 1 }}>{cat}</span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{items.length} ερωτήσεις ›</span>
                  </button>
                );
              })}
            </div>

            {/* Ή γράψε ελεύθερο κείμενο */}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ή γράψε τη δική σου ερώτηση..."
                style={{
                  flex: 1, background: "var(--surface3)", border: "1.5px solid var(--border)",
                  borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "var(--text)",
                  outline: "none", fontFamily: "'Instrument Sans', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e  => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim()} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: input.trim() ? "var(--accent)" : "var(--surface3)",
                border: "1px solid var(--border)", cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 16, filter: input.trim() ? "none" : "opacity(0.3)", color: "#000" }}>➤</span>
              </button>
            </div>
          </div>
        )}

        {/* ── CATEGORIES SCREEN ── */}
        {screen === "categories" && (
          <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
            <button onClick={() => setScreen("welcome")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text2)", fontSize: 13, marginBottom: 14,
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700,
            }}>← Πίσω</button>

            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 12, fontFamily: "'Cabinet Grotesk',sans-serif" }}>
              {activeCategory}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {QA.filter(q => q.category === activeCategory).map(item => (
                <button key={item.q} onClick={() => sendMessage(item.q)} style={chipStyle()}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.q}</span>
                  <span style={{ color: "var(--text3)", fontSize: 14 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT SCREEN ── */}
        {(screen === "chat" || screen === "followup") && (
          <>
            <div style={{
              flex: 1, overflowY: "auto", padding: "14px 12px",
              display: "flex", flexDirection: "column", gap: 10,
              scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent",
            }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: 6,
                }}>
                  {m.role === "assistant" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: "var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0,
                    }}>🅿️</div>
                  )}
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.role === "user" ? "var(--accent)" : "var(--surface2)",
                    color: m.role === "user" ? "#000" : "var(--text)",
                    fontSize: 13, lineHeight: 1.65,
                    wordBreak: "break-word", whiteSpace: "pre-line",
                    fontWeight: m.role === "user" ? 600 : 400,
                  }}>{m.content}</div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>🅿️</div>
                  <div style={{
                    padding: "11px 15px", background: "var(--surface2)",
                    borderRadius: "18px 18px 18px 4px",
                    display: "flex", gap: 5, alignItems: "center",
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

              {/* ── FOLLOW-UP PROMPT ── */}
              {screen === "followup" && !loading && (
                <div style={{
                  background: "var(--surface2)", borderRadius: 16,
                  padding: "14px", marginTop: 4,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{
                    fontSize: 13, color: "var(--text)", marginBottom: 10,
                    fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700,
                  }}>
                    Θέλεις να ρωτήσεις κάτι άλλο;
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setScreen("welcome")} style={{
                      ...chipStyle(true),
                      flex: 1, justifyContent: "center", padding: "9px 12px", borderRadius: 10,
                    }}>
                      Ναι, δες θέματα
                    </button>
                    <button onClick={handleClear} style={{
                      ...chipStyle(),
                      flex: 1, justifyContent: "center", padding: "9px 12px", borderRadius: 10,
                    }}>
                      Όχι, ευχαριστώ
                    </button>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input — εμφανίζεται μόνο στο chat, όχι followup */}
            {screen === "chat" && (
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
                    flex: 1, background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderRadius: 20, padding: "10px 14px", fontSize: 13, color: "var(--text)",
                    outline: "none", fontFamily: "'Instrument Sans', sans-serif",
                    transition: "border-color .15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: input.trim() && !loading ? "var(--accent)" : "var(--surface)",
                  border: "1px solid var(--border)",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background .2s", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16, filter: input.trim() && !loading ? "none" : "opacity(0.3)", color: "#000" }}>➤</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes chatPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
