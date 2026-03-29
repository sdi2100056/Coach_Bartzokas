// ── components/SupportModal.js ──
import { useState } from "react";
import Icon from "./Icon";

function SupportModal({ onClose, prefillName, prefillEmail }) {
  const [step, setStep]         = useState("form"); // "form" | "success"
  const [category, setCategory] = useState("");
  const [name, setName]         = useState(prefillName || "");
  const [email, setEmail]       = useState(prefillEmail || "");
  const [subject, setSubject]   = useState("");
  const [message, setMessage]   = useState("");
  const [errors, setErrors]     = useState({});

  const categories = ["Κράτηση", "Πληρωμή", "Τεχνικό", "Άλλο"];

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const e = {};
    if (!name.trim())          e.name     = "Απαιτείται όνομα";
    if (!email.trim())         e.email    = "Απαιτείται email";
    else if (!validateEmail(email)) e.email = "Το email πρέπει να περιέχει @";
    if (!category)             e.category = "Επίλεξε κατηγορία";
    if (!subject.trim())       e.subject  = "Απαιτείται θέμα";
    if (!message.trim())       e.message  = "Γράψε το πρόβλημά σου";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setStep("success"); };

  const ticketId = "SP-" + Math.floor(10000 + Math.random() * 90000);

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        {step === "success" ? (
          <div className="support-success">
            <div className="support-success-icon"><Icon name="check" size={28} /></div>
            <div className="support-success-title">Το αίτημά σου στάλθηκε! 🎉</div>
            <div className="support-success-sub">
              Η ομάδα υποστήριξής μας θα επικοινωνήσει μαζί σου στο <strong>{email}</strong> εντός 24 ωρών.
            </div>
            <div className="ticket-badge">#{ticketId}</div>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={onClose}>Κλείσιμο</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-icon"><Icon name="headset" size={22} /></div>
              <div>
                <div className="modal-title">Υποστήριξη 24/7</div>
                <div className="modal-subtitle">Συμπλήρωσε τα στοιχεία σου και θα σε βοηθήσουμε άμεσα</div>
              </div>
              <button className="modal-close" onClick={onClose}><Icon name="close" size={16} /></button>
            </div>

            {/* Name */}
            <div className="support-field">
              <label className="support-label">Ονοματεπώνυμο *</label>
              <input
                className={`support-input${errors.name ? " error" : ""}`}
                placeholder="Το όνομά σου"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              />
              {errors.name && <div className="error-hint">⚠ {errors.name}</div>}
            </div>

            {/* Email */}
            <div className="support-field">
              <label className="support-label">Email επικοινωνίας *</label>
              <input
                className={`support-input${errors.email ? " error" : ""}`}
                placeholder="example@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
              />
              {errors.email && <div className="error-hint">⚠ {errors.email}</div>}
            </div>

            {/* Category */}
            <div className="support-field">
              <label className="support-label">Κατηγορία προβλήματος *</label>
              <div className="category-grid">
                {categories.map(c => (
                  <div
                    key={c}
                    className={`cat-opt${category === c ? " sel" : ""}`}
                    onClick={() => { setCategory(c); setErrors(p => ({ ...p, category: "" })); }}
                  >{c}</div>
                ))}
              </div>
              {errors.category && <div className="error-hint">⚠ {errors.category}</div>}
            </div>

            {/* Subject */}
            <div className="support-field">
              <label className="support-label">Θέμα *</label>
              <input
                className={`support-input${errors.subject ? " error" : ""}`}
                placeholder="Σύντομη περιγραφή του προβλήματος"
                value={subject}
                onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: "" })); }}
              />
              {errors.subject && <div className="error-hint">⚠ {errors.subject}</div>}
            </div>

            {/* Message */}
            <div className="support-field">
              <label className="support-label">Περιγραφή προβλήματος *</label>
              <textarea
                className={`support-textarea${errors.message ? " error" : ""}`}
                placeholder="Περίγραψε αναλυτικά το πρόβλημά σου..."
                value={message}
                onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
                rows={4}
              />
              {errors.message && <div className="error-hint">⚠ {errors.message}</div>}
            </div>

            <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 4 }}>
              <Icon name="send" size={16} /> Αποστολή αιτήματος
            </button>

            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 12 }}>
              🔒 Τα στοιχεία σου είναι ασφαλή · Απάντηση εντός 24 ωρών
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SupportModal;
