// ── pages/HomePage.js ──
import Icon from "../components/Icon";

function HomePage({ listings, search, setSearch, filter, setFilter, setDetail, toggle, darkMode }) {
  const filters = ["Όλα", "Κοντά μου", "Αεροδρόμιο", "Κλειστά", "Airport"];

  const filtered = listings.filter(l => {
    const m =
      (l.title   || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.address || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "Κλειστά")  return m && l.type === "Κλειστό γκαράζ";
    if (filter === "Airport")  return m && (l.tags || []).includes("Αεροδρόμιο");
    return m;
  });

  return (
    <div className="pb-nav">
      {/* Top bar */}
      <div className="top-bar">
        <div className="logo">Park<span style={{ color: "var(--accent)" }}>Share</span></div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <div className="search-icon"><Icon name="search" size={18} /></div>
        <input
          className="search-input"
          placeholder="Πού θέλεις να παρκάρεις;"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        {filters.map(f => (
          <div
            key={f}
            className={`filter-chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >{f}</div>
        ))}
      </div>

      <div className="section" style={{ marginTop: 8 }}>
        <div className="section-title">⭐ Πρόσφατες θέσεις</div>
      </div>

      {listings.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text2)", fontSize: "14px" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          Η βάση είναι άδεια!<br />
          Πήγαινε στο μενού <strong>"Πρόσθεσε"</strong> για να ανεβάσεις την πρώτη αγγελία.
        </div>
      ) : (
        <>
          {/* Horizontal scroll */}
          <div className="h-scroll">
            {listings.slice(0, 4).map(l => (
              <div key={l.id} className="hcard" onClick={() => setDetail(l)}>
                <div className="hcard-emoji">{l.img}</div>
                <div className="hcard-body">
                  <div className="hcard-title">{l.title}</div>
                  <div className="hcard-price">€{l.price}/{l.priceUnit}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Full results */}
          <div className="section" style={{ marginTop: 20 }}>
            <div className="section-title">
              🔍 Αποτελέσματα
              <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 400 }}>{filtered.length} θέσεις</span>
            </div>
            {filtered.map(l => (
              <div key={l.id} className="card" onClick={() => setDetail(l)}>
                <div className="card-emoji" style={{ background: "var(--surface2)" }}>
                  {l.img}
                  <div className="card-tag">{l.type === "Κλειστό γκαράζ" ? "🏠 Κλειστό" : "🌿 Υπαίθριο"}</div>
                </div>
                <div className="card-body">
                  <div className="card-title">{l.title}</div>
                  <div className="card-addr">📍 {l.address}</div>
                  <div className="card-row">
                    <div className="card-rating">
                      <Icon name="star" size={13} />{l.rating}
                      <span style={{ color: "var(--text2)" }}>({l.reviews} κριτικές)</span>
                    </div>
                    <div className="card-price">€{l.price} <span>/{l.priceUnit}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
