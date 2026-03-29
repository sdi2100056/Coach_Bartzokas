// ── pages/DetailPage.js ──
import Icon from "../components/Icon";

function DetailPage({ listing: l, onClose, onBook }) {
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
          {(l.tags || []).map(t => <div key={t} className="tag">{t}</div>)}
        </div>

        <div className="detail-title">{l.title}</div>
        <div className="detail-addr">📍 {l.address}</div>
        <div className="detail-price">€{l.price} <span>/{l.priceUnit}</span></div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Τύπος</div>
            <div className="info-val">{l.type}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Διαθεσιμότητα</div>
            <div className="info-val">{l.available}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Πλάτος</div>
            <div className="info-val">{l.width}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Παράδοση Κλειδιού</div>
            <div className="info-val">{l.keyDelivery || "-"}</div>
          </div>
        </div>

        {/* Feature tags */}
        {l.features && l.features.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 8 }}>Χαρακτηριστικά</div>
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

        {/* Owner */}
        <div className="owner-row">
          <div className="owner-ava">🏠</div>
          <div>
            <div className="owner-name">{l.owner}</div>
            <div className="owner-since">Μέλος από το 2026</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4, color: "#f59e0b", fontSize: 13, alignItems: "center" }}>
            <Icon name="star" size={13} />{l.rating}
            <span style={{ color: "var(--text2)" }}>({l.reviews})</span>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="map-placeholder">
          <Icon name="map" size={28} />
          <span>Χάρτης περιοχής</span>
        </div>

        <button className="btn btn-primary" onClick={() => onBook(l)}>
          <Icon name="calendar" size={18} /> Κράτηση τώρα
        </button>
      </div>
    </div>
  );
}

export default DetailPage;
