/* ── theme.js — dynamic dark/light CSS variables ──
   Exported as a JS function because the values depend on the darkMode boolean.
   Usage: <style>{getThemeVars(darkMode)}</style>
*/

export const getThemeVars = (dark) => `
  :root {
    --bg:          ${dark ? "#0a0f1e"                : "#f4f6fb"};
    --surface:     ${dark ? "#111827"                : "#ffffff"};
    --surface2:    ${dark ? "#1a2235"                : "#eef1f7"};
    --surface3:    ${dark ? "#212d42"                : "#e4e8f2"};
    --border:      ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    --text:        ${dark ? "#f0f4ff"                : "#0d1526"};
    --text2:       ${dark ? "#8895b0"                : "#5a6a85"};
    --text3:       ${dark ? "#4a5568"                : "#aab4c8"};
    --shadow:      ${dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)"};
    --nav-bg:      ${dark ? "rgba(17,24,39,0.97)"   : "rgba(255,255,255,0.97)"};
    --back-btn-bg: ${dark ? "rgba(0,0,0,0.6)"       : "rgba(255,255,255,0.9)"};
  }

  body { background: var(--bg); color: var(--text); }
  .app  { background: var(--bg); }
  .logo { color: var(--text); }

  /* nav */
  .nav { background: var(--nav-bg); border-top: 1px solid var(--border); }
  @media (min-width: 768px) { .nav { border-top: none; border-bottom: 1px solid var(--border); } }
  .nav-item        { color: var(--text3); }
  .nav-item.active { color: var(--accent); }
  @media (min-width: 768px) { .nav-item.active { background: rgba(0,201,138,0.1); } }

  /* top-bar / toggle */
  .theme-toggle       { border: 1px solid var(--border); background: var(--surface2); color: var(--text2); }
  .theme-toggle:hover { background: var(--surface3); color: var(--accent); }

  /* search */
  .search-input             { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
  .search-input:focus       { border-color: var(--accent); }
  .search-input::placeholder{ color: var(--text3); }
  .search-icon              { color: var(--text3); }
  .filter-chip              { border: 1px solid var(--border); background: var(--surface); color: var(--text2); }

  /* cards */
  .card           { background: var(--surface); border: 1px solid var(--border); box-shadow: none; }
  .card:hover     { box-shadow: var(--shadow); }
  .card-title     { color: var(--text); }
  .card-addr      { color: var(--text2); }
  .card-price     { color: var(--text); }
  .card-price span{ color: var(--text2); }
  .hcard          { background: var(--surface); border: 1px solid var(--border); }
  .hcard-emoji    { background: var(--surface2); }
  .hcard-title    { color: var(--text); }
  .section-title  { color: var(--text); }

  /* page overlay */
  .page       { background: var(--bg); }
  .back-btn   { background: var(--back-btn-bg); color: var(--text); }
  .detail-hero{ background: var(--surface2); }
  .detail-title{ color: var(--text); }
  .detail-addr { color: var(--text2); }
  .detail-price span { color: var(--text2); }
  .info-item  { background: var(--surface); border: 1px solid var(--border); }
  .info-label { color: var(--text2); }
  .info-val   { color: var(--text); }
  .owner-row  { background: var(--surface); border: 1px solid var(--border); }
  .owner-name { color: var(--text); }
  .owner-since{ color: var(--text2); }
  .map-placeholder { background: var(--surface); border: 1px solid var(--border); color: var(--text2); }

  /* booking */
  .book-section  { background: var(--surface); border: 1px solid var(--border); }
  .book-title    { color: var(--text); }
  .book-field    { background: var(--surface2); border: 1px solid var(--border); }
  .book-field label { color: var(--text2); }
  .book-field input, .book-field select { color: var(--text); }
  .book-field select option { background: var(--surface2); color: var(--text); }
  .price-summary { background: var(--surface2); }
  .price-row     { color: var(--text2); }
  .price-row.total { color: var(--text); border-top-color: var(--border); }
  .btn-secondary { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
  .booking-card  { background: var(--surface); border: 1px solid var(--border); }
  .booking-title { color: var(--text); }
  .badge-done    { background: var(--surface2); }
  .success-code  { background: var(--surface); border: 1px solid var(--border); }
  .code-label    { color: var(--text2); }
  .success-title { color: var(--text); }
  .success-sub   { color: var(--text2); }

  /* dashboard */
  .stat-card  { background: var(--surface); border: 1px solid var(--border); }
  .stat-label { color: var(--text2); }
  .rev-label  { color: var(--text2); }
  .rev-sub    { color: var(--text2); }

  /* forms / listing */
  .form-label  { color: var(--text2); }
  .form-input  { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
  .form-input::placeholder { color: var(--text3); }
  .toggle-opt  { background: var(--surface); border: 2px solid var(--border); color: var(--text2); }

  /* profile */
  .profile-name  { color: var(--text); }
  .profile-email { color: var(--text2); }
  .menu-item     { border-bottom: 1px solid var(--border); }
  .menu-item:hover { background: var(--surface2); }
  .menu-icon     { background: var(--surface2); }
  .menu-title    { color: var(--text); }
  .menu-sub      { color: var(--text2); }

  /* support modal */
  .modal-sheet         { background: var(--surface); }
  .modal-title         { color: var(--text); }
  .modal-subtitle      { color: var(--text2); }
  .modal-close         { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }
  .modal-close:hover   { color: var(--accent); }
  .support-label       { color: var(--text2); }
  .support-input       { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
  .support-input::placeholder { color: var(--text3); }
  .support-textarea    { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
  .support-textarea::placeholder { color: var(--text3); }
  .cat-opt             { background: var(--surface2); border: 2px solid var(--border); color: var(--text2); }
  .support-success-title { color: var(--text); }
  .support-success-sub   { color: var(--text2); }
`;
