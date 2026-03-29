// ── pages/HomePage.js ──
import { useState, useRef, useEffect } from "react";
import Icon from "../components/Icon";
import { t, AREAS } from "../i18n";

function HomePage({ listings, search, setSearch, filter, setFilter, setDetail, toggle, darkMode, lang }) {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // ── Φίλτρα (μεταφρασμένα) ──
  const filters = [
    t(lang, "filter_all"),
    t(lang, "filter_near"),
    t(lang, "filter_airport"),
    t(lang, "filter_closed"),
  ];

  // ── Smart search: προτάσεις περιοχών ──
  // Εμφανίζεται όταν έχει τουλάχιστον 1 χαρακτήρα και δεν υπάρχουν αγγελίες που ταιριάζουν
  const areaList = AREAS[lang] ?? AREAS.el;

  const areaSuggestions = search.length >= 1
    ? areaList.filter(area =>
        area.toLowerCase().startsWith(search.toLowerCase())
      ).slice(0, 6)
    : [];

  // Κλείσε τις προτάσεις αν κλικάρεις έξω
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Φιλτράρισμα αγγελιών ──
  const filtered = listings.filter(l => {
    const q = search.toLowerCase();
    const m =
      (l.title   || "").toLowerCase().includes(q) ||
      (l.address || "").toLowerCase().includes(q);
    if (filter === t(lang, "filter_closed")) return m && (l.type === "Κλειστό γκαράζ" || l.type === "Indoor garage");
    if (filter === t(lang, "filter_airport")) return m && (l.tags || []).some(tag => tag.toLowerCase().includes("airport") || tag.toLowerCase().includes("αεροδρόμιο"));
    return m;
  });

  const handleSuggestionClick = (area) => {
    setSearch(area);
    setShowSuggestions(false);
  };

  return (
    <div className="pb-nav">
      {/* Top bar */}
      <div className="top-bar">
        <div className="logo">Park<span style={{ color: "var(--accent)" }}>Share</span></div>
        <button className="theme-toggle" onClick={toggle}>
          <Icon name={darkMode ? "sun" : "moon"} size={18} />
        </button>
      </div>

      {/* ── Smart Search ── */}
      <div className="search-wrap" ref={searchRef} style={{ position: "relative" }}>
        <div className="search-icon"><Icon name="search" size={18} /></div>
        <input
          className="search-input"
          placeholder={t(lang, "search_placeholder")}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => search.length >= 1 && setShowSuggestions(true)}
          autoComplete="off"
        />

        {/* Dropdown προτάσεων */}
        {showSuggestions && areaSuggestions.length > 0 && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0, right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            zIndex: 300,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 14px 4px",
              fontSize: 10,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              letterSpacing: ".6px",
              textTransform: "uppercase",
              color: "var(--text3)",
            }}>
              {t(lang, "suggestions")}
            </div>
            {areaSuggestions.map((area, i) => (
              <div
                key={area}
                onClick={() => handleSuggestionClick(area)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Highlight matching prefix */}
                <Icon name="pin" size={14} />
                <span style={{ fontSize: 14, color: "var(--text)" }}>
                  <strong style={{ color: "var(--accent)" }}>
                    {area.slice(0, search.length)}
                  </strong>
                  {area.slice(search.length)}
                </span>
              </div>
            ))}
          </div>
        )}
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
        <div className="section-title">{t(lang, "recent")}</div>
      </div>

      {listings.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text2)", fontSize: "14px" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          {t(lang, "empty_title")}<br />
          {t(lang, "empty_sub")}
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
              {t(lang, "results")}
              <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 400 }}>
                {filtered.length} {t(lang, "spots")}
              </span>
            </div>
            {filtered.map(l => (
              <div key={l.id} className="card" onClick={() => setDetail(l)}>
                <div className="card-emoji" style={{ background: "var(--surface2)" }}>
                  {l.img}
                  <div className="card-tag">
                    {l.type === "Κλειστό γκαράζ" || l.type === "Υπόγειο" || l.type === "Indoor garage"
                      ? t(lang, "closed_tag")
                      : t(lang, "outdoor_tag")}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{l.title}</div>
                  <div className="card-addr">📍 {l.address}</div>
                  <div className="card-row">
                    <div className="card-rating">
                      <Icon name="star" size={13} />
                      {l.rating}
                      <span style={{ color: "var(--text2)" }}>
                        ({l.reviews} {t(lang, "reviews")})
                      </span>
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
