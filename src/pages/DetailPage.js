// ── pages/DetailPage.js ──
import { useState } from "react";
import Icon from "../components/Icon";
import { t } from "../i18n";

// ── Star Rating Component ──
function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value || 0;

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            fontSize: 28,
            cursor: readOnly ? "default" : "pointer",
            color: display >= star ? "#f59e0b" : "var(--surface3)",
            transition: "color .15s, transform .1s",
            transform: !readOnly && hovered === star ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function DetailPage({ listing: l, onClose, onBook, onRate, lang = "el" }) {

  const [pendingRating, setPendingRating]   = useState(l.userRating ?? 0);
  const [ratingSaved,   setRatingSaved]     = useState(false);
  const [savingRating,  setSavingRating]    = useState(false);

  const handleSaveRating = () => {
    if (!pendingRating) return;
    setSavingRating(true);
    // Simulate tiny async delay for UX feedback
    setTimeout(() => {
      onRate(l.id, pendingRating);
      setRatingSaved(true);
      setSavingRating(false);
    }, 300);
  };

  return (
    <div className="page">
      {/* Hero */}
      <div className="detail-hero">
        {l.img}
        <button className="back-btn" onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="detail-body">
        {/* Tags */}
        <div className="tags-wrap">
          {(l.tags || []).map(tag => <div key={tag} className="tag">{tag}</div>)}
        </div>

        <div className="detail-title">{l.title}</div>
        <div className="detail-addr">📍 {l.address}</div>
        <div className="detail-price">
          €{l.price} <span>/{t(lang, "per_hour")}</span>
        </div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">{t(lang, "type")}</div>
            <div className="info-val">{l.type}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t(lang, "avail")}</div>
            <div className="info-val">{l.available}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t(lang, "width")}</div>
            <div className="info-val">{l.width}</div>
          </div>
          <div className="info-item">
            <div className="info-label">{t(lang, "key_handover")}</div>
            <div className="info-val">{l.keyDelivery || "-"}</div>
          </div>
        </div>

        {/* Feature tags */}
        {l.features && l.features.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 8 }}>
              {t(lang, "characteristics")}
            </div>
            <div className="tags-wrap">
              {l.features.map(f => (
                <div key={f} className="tag"
                  style={{ background: "var(--surface2)", color: "var(--text)", border: "none" }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner row */}
        <div className="owner-row">
          <div className="owner-ava">🏠</div>
          <div>
            <div className="owner-name">{l.owner}</div>
            <div className="owner-since">{t(lang, "member_since")}</div>
          </div>
          <div style={{
            marginLeft: "auto",
            display: "flex", gap: 4,
            color: "#f59e0b", fontSize: 13,
            alignItems: "center",
          }}>
            <Icon name="star" size={13} />
            {l.rating}
            <span style={{ color: "var(--text2)" }}>({l.reviews})</span>
          </div>
        </div>

        {/* ── Rating Widget (Feature 3) ── */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "18px 16px",
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--text)",
            marginBottom: 12,
          }}>
            {t(lang, "rate_listing")}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <StarRating
              value={pendingRating}
              onChange={(star) => {
                setPendingRating(star);
                setRatingSaved(false);
              }}
            />
            {pendingRating > 0 && (
              <span style={{ fontSize: 13, color: "var(--text2)" }}>
                {t(lang, "your_rating")} <strong style={{ color: "var(--text)" }}>{pendingRating}/5</strong>
              </span>
            )}
          </div>

          {!pendingRating && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
              {t(lang, "tap_star")}
            </div>
          )}

          {pendingRating > 0 && !ratingSaved && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 12, padding: "10px 16px", width: "auto", fontSize: 13 }}
              onClick={handleSaveRating}
              disabled={savingRating}
            >
              {savingRating ? "..." : t(lang, "save_rating")}
            </button>
          )}

          {ratingSaved && (
            <div style={{
              marginTop: 10,
              fontSize: 13,
              color: "var(--accent)",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
            }}>
              {t(lang, "rating_saved")}
            </div>
          )}
        </div>

        {/* Map placeholder */}
        <div className="map-placeholder">
          <Icon name="map" size={28} />
          <span>{t(lang, "map_area")}</span>
        </div>

        <button className="btn btn-primary" onClick={() => onBook(l)}>
          <Icon name="calendar" size={18} /> {t(lang, "book_now")}
        </button>
      </div>
    </div>
  );
}

export default DetailPage;
