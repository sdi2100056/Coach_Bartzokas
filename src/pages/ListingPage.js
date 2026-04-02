// ── pages/ListingPage.js ──
import Icon from "../components/Icon";

function ListingPage({
  listingStep, setListingStep,
  listingType, setListingType,
  formData, handleFormChange, toggleFeature,
  emailError,
  handleAddListing,
  toggle, darkMode,
}) {
  return (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Νέα <span style={{ color: "var(--accent)" }}>Θέση</span></div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 12 }}>
          Βήμα {listingStep} από 3
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              height: 4, flex: 1, borderRadius: 2,
              background: s <= listingStep ? "var(--accent)" : "var(--surface2)",
              transition: "background .3s"
            }} />
          ))}
        </div>

        {/* ── Step 1: Location & type ── */}
        {listingStep === 1 && <>
          <div className="form-section">
            <label className="form-label">Τίτλος θέσης</label>
            <input className="form-input" placeholder="π.χ. Γκαράζ Κολωνάκι"
              value={formData.title}
              onChange={e => handleFormChange("title", e.target.value)} />
          </div>

          <div className="form-section">
            <label className="form-label">Διεύθυνση</label>
            <input className="form-input" placeholder="Οδός, Αριθμός, Περιοχή"
              value={formData.address}
              onChange={e => handleFormChange("address", e.target.value)} />
          </div>

          <div className="form-section">
            <label className="form-label">Τύπος χώρου</label>
            <div className="toggle-grid">
              {["Κλειστό γκαράζ", "Υπαίθριος χώρος", "Υπόγειο", "Αυλή"].map(t => (
                <div key={t}
                  className={`toggle-opt ${listingType === t ? "sel" : ""}`}
                  onClick={() => setListingType(t)}
                >{t}</div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Διαστάσεις (προαιρετικό)</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input className="form-input" placeholder="Πλάτος"
                value={formData.width}
                onChange={e => handleFormChange("width", e.target.value)} />
              <input className="form-input" placeholder="Ύψος"
                value={formData.height}
                onChange={e => handleFormChange("height", e.target.value)} />
            </div>
          </div>
        </>}

        {/* ── Step 2: Pricing & features ── */}
        {listingStep === 2 && <>
          <div className="form-section">
            <label className="form-label">Τιμή ανά ώρα (€)</label>
            <input className="form-input" type="number" placeholder="π.χ. 2.50"
              value={formData.price}
              onChange={e => handleFormChange("price", e.target.value)} />
          </div>

          <div className="form-section">
            <label className="form-label">Ώρες διαθεσιμότητας</label>
            <input className="form-input" placeholder="π.χ. 08:00 – 22:00"
              value={formData.available}
              onChange={e => handleFormChange("available", e.target.value)} />
          </div>

          <div className="form-section">
            <label className="form-label">Χαρακτηριστικά</label>
            <div className="toggle-grid">
              {["Κάμερα", "Φωτισμός", "Φόρτιση", "ΑΜΕΑ"].map(t => (
                <div key={t}
                  className={`toggle-opt ${formData.features.includes(t) ? "sel" : ""}`}
                  onClick={() => toggleFeature(t)}
                >{t}</div>
              ))}
            </div>
          </div>
        </>}

        {/* ── Step 3: Key delivery & contact ── */}
        {listingStep === 3 && <>
          <div className="form-section">
            <label className="form-label">Τρόπος παράδοσης κλειδιού</label>
            <div className="toggle-grid">
              {["Προσωπικά", "Κλειδοθήκη", "Smart Lock", "Γείτονας"].map(t => (
                <div key={t}
                  className={`toggle-opt ${formData.keyDelivery === t ? "sel" : ""}`}
                  onClick={() => handleFormChange("keyDelivery", t)}
                >{t}</div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Επικοινωνία</label>
            <input className="form-input" placeholder="Κινητό τηλέφωνο"
              style={{ marginBottom: 8 }}
              value={formData.phone}
              onChange={e => handleFormChange("phone", e.target.value)} />
            <input
              className={`form-input${emailError ? " error" : ""}`}
              style={{ border: emailError ? "1px solid var(--accent3)" : undefined }}
              placeholder="Email (υποχρεωτικό @)"
              value={formData.email}
              onChange={e => handleFormChange("email", e.target.value)}
            />
            {emailError && (
              <div style={{ fontSize: 11, color: "var(--accent3)", marginTop: 4 }}>
                ⚠ {emailError}
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(255,107,53,0.1)",
            border: "1px solid rgba(255,107,53,0.3)",
            borderRadius: 12, padding: 14, marginBottom: 16,
            display: "flex", gap: 10
          }}>
            <Icon name="warning" size={16} />
            <div style={{ fontSize: 12, color: "var(--accent3)", lineHeight: 1.5 }}>
              Βεβαιώσου ότι επιτρέπεται από τον κανονισμό της πολυκατοικίας σου η εκμίσθωση.
            </div>
          </div>
        </>}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {listingStep > 1 && (
            <button className="btn btn-secondary" style={{ maxWidth: 100 }}
              onClick={() => setListingStep(s => s - 1)}>
              ← Πίσω
            </button>
          )}
          <button className="btn btn-primary"
            onClick={() => listingStep < 3 ? setListingStep(s => s + 1) : handleAddListing()}>
            {listingStep < 3 ? "Επόμενο →" : "✅ Δημοσίευση"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingPage;
