// ── components/SupportModal.js ──
import { useState } from "react";
import Icon from "./Icon";
import { t } from "../i18n";

function SupportModal({ onClose, prefillName, prefillEmail, lang = "el" }) {
  const [step,     setStep]     = useState("form"); // "form" | "success"
  const [category, setCategory] = useState("");
  const [name,     setName]     = useState(prefillName  || "");
  const [email,    setEmail]    = useState(prefillEmail || "");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [errors,   setErrors]   = useState({});

  const categories = [
    t(lang, "cat_booking"),
    t(lang, "cat_payment"),
    t(lang, "cat_tech"),
    t(lang, "cat_other"),
  ];

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const e = {};
    if (!name.trim())            e.name     = t(lang, "err_name");
    if (!email.trim())           e.email    = t(lang, "err_email_req");
    else if (!validateEmail(email)) e.email = t(lang, "err_email_fmt");
    if (!category)               e.category = t(lang, "err_category");
    if (!subject.trim())         e.subject  = t(lang, "err_subject");
    if (!message.trim())         e.message  = t(lang, "err_message");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setStep("success"); };

  const ticketId = "SP-" + Math.floor(10000 + Math.random() * 90000);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet">
        <div className="modal-handle" />

        {step === "success" ? (
          /* ── Success screen ── */
          <div className="support-success">
            <div className="support-success-icon">
              <Icon name="check" size={28} />
            </div>
            <div className="support-success-title">{t(lang, "sent_title")}</div>
            <div className="support-success-sub">
              {t(lang, "sent_body")} <strong>{email}</strong> {t(lang, "sent_body2")}
            </div>
            <div className="ticket-badge">#{ticketId}</div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 24 }}
              onClick={onClose}
            >
              {t(lang, "btn_close")}
            </button>
          </div>

        ) : (
          /* ── Form ── */
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <Icon name="headset" size={22} />
              </div>
              <div>
                <div className="modal-title">{t(lang, "support_title")}</div>
                <div className="modal-subtitle">{t(lang, "support_subtitle")}</div>
              </div>
              <button className="modal-close" onClick={onClose}>
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Name */}
            <div className="support-field">
              <label className="support-label">{t(lang, "field_name")}</label>
              <input
                className={`support-input${errors.name ? " error" : ""}`}
                placeholder={t(lang, "field_name_ph")}
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              />
              {errors.name && <div className="error-hint">⚠ {errors.name}</div>}
            </div>

            {/* Email */}
            <div className="support-field">
              <label className="support-label">{t(lang, "field_email")}</label>
              <input
                className={`support-input${errors.email ? " error" : ""}`}
                placeholder={t(lang, "field_email_ph")}
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
              />
              {errors.email && <div className="error-hint">⚠ {errors.email}</div>}
            </div>

            {/* Category */}
            <div className="support-field">
              <label className="support-label">{t(lang, "field_category")}</label>
              <div className="category-grid">
                {categories.map(c => (
                  <div
                    key={c}
                    className={`cat-opt${category === c ? " sel" : ""}`}
                    onClick={() => { setCategory(c); setErrors(p => ({ ...p, category: "" })); }}
                  >
                    {c}
                  </div>
                ))}
              </div>
              {errors.category && <div className="error-hint">⚠ {errors.category}</div>}
            </div>

            {/* Subject */}
            <div className="support-field">
              <label className="support-label">{t(lang, "field_subject")}</label>
              <input
                className={`support-input${errors.subject ? " error" : ""}`}
                placeholder={t(lang, "field_subject_ph")}
                value={subject}
                onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: "" })); }}
              />
              {errors.subject && <div className="error-hint">⚠ {errors.subject}</div>}
            </div>

            {/* Message */}
            <div className="support-field">
              <label className="support-label">{t(lang, "field_message")}</label>
              <textarea
                className={`support-textarea${errors.message ? " error" : ""}`}
                placeholder={t(lang, "field_message_ph")}
                value={message}
                onChange={e => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
                rows={4}
              />
              {errors.message && <div className="error-hint">⚠ {errors.message}</div>}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ marginTop: 4 }}
            >
              <Icon name="send" size={16} /> {t(lang, "btn_send")}
            </button>

            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 12 }}>
              {t(lang, "privacy_note")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SupportModal;
