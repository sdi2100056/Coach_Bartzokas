/* ── theme.js ── */

export const getThemeVars = (dark) => `
  :root {
    --bg:          ${dark ? "#080c14"                : "#f0f4f8"};
    --surface:     ${dark ? "#0f1623"                : "#ffffff"};
    --surface2:    ${dark ? "#161e2e"                : "#f7f9fc"};
    --surface3:    ${dark ? "#1e2a3d"                : "#edf1f7"};
    --border:      ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    --border2:     ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
    --text:        ${dark ? "#eef2ff"                : "#0d1526"};
    --text2:       ${dark ? "#7a8aaa"                : "#5a6a85"};
    --text3:       ${dark ? "#3d4f6e"                : "#b0bcce"};
    --shadow:      ${dark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.08)"};
    --shadow-sm:   ${dark ? "0 4px 16px rgba(0,0,0,0.4)"  : "0 2px 12px rgba(0,0,0,0.06)"};
    --glow:        ${dark ? "0 0 40px rgba(0,229,160,0.12)" : "0 0 40px rgba(0,229,160,0.08)"};
    --nav-bg:      ${dark ? "rgba(8,12,20,0.96)"    : "rgba(255,255,255,0.96)"};
    --back-btn-bg: ${dark ? "rgba(15,22,35,0.85)"   : "rgba(255,255,255,0.92)"};
    --gradient:    ${dark
      ? "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(59,130,246,0.04) 100%)"
      : "linear-gradient(135deg, rgba(0,229,160,0.05) 0%, rgba(59,130,246,0.03) 100%)"};
  }

  body { background: var(--bg); color: var(--text); }
  .app { background: var(--bg); }

  /* ── Logo ── */
  .logo { color: var(--text); }
  .logo span { 
    background: linear-gradient(90deg, var(--accent), #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Nav ── */
  .nav {
    background: var(--nav-bg);
    border-top: 1px solid var(--border);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  @media (min-width: 768px) { .nav { border-top: none; border-bottom: 1px solid var(--border); } }
  .nav-item        { color: var(--text3); }
  .nav-item.active { color: var(--accent); }
  @media (min-width: 768px) {
    .nav-item.active { background: rgba(0,229,160,0.08); border-radius: 10px; }
  }

  /* ── Theme toggle ── */
  .theme-toggle       { border: 1px solid var(--border2); background: var(--surface2); color: var(--text2); }
  .theme-toggle:hover { background: var(--surface3); color: var(--accent); border-color: var(--accent); }

  /* ── Search ── */
  .search-input              { background: var(--surface); border: 1.5px solid var(--border); color: var(--text); }
  .search-input:focus        { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,160,0.1); }
  .search-input::placeholder { color: var(--text3); }
  .search-icon               { color: var(--text3); }
  .filter-chip               { border: 1.5px solid var(--border); background: var(--surface2); color: var(--text2); }
  .filter-chip:hover         { border-color: var(--border2); color: var(--text); }

  /* ── Cards ── */
  .card       { background: var(--surface); border: 1px solid var(--border); }
  .card:hover { box-shadow: var(--shadow); border-color: var(--border2); }
  .card-title { color: var(--text); }
  .card-addr  { color: var(--text2); }
  .card-price { color: var(--text); }
  .card-price span { color: var(--text2); }
  .hcard           { background: var(--surface); border: 1px solid var(--border); }
  .hcard:hover     { border-color: var(--accent); box-shadow: var(--glow); }
  .hcard-emoji     { background: var(--surface2); }
  .hcard-title     { color: var(--text); }
  .section-title   { color: var(--text); }

  /* ── Page overlay ── */
  .page        { background: var(--bg); }
  .back-btn    { background: var(--back-btn-bg); color: var(--text); border: 1px solid var(--border); backdrop-filter: blur(12px); }
  .detail-hero { background: var(--surface2); }
  .detail-title { color: var(--text); }
  .detail-addr  { color: var(--text2); }
  .detail-price span { color: var(--text2); }
  .info-item   { background: var(--surface); border: 1px solid var(--border); }
  .info-label  { color: var(--text2); }
  .info-val    { color: var(--text); }
  .owner-row   { background: var(--surface); border: 1px solid var(--border); }
  .owner-name  { color: var(--text); }
  .owner-since { color: var(--text2); }
  .map-placeholder { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }

  /* ── Booking ── */
  .book-section { background: var(--surface); border: 1px solid var(--border); }
  .book-title   { color: var(--text); }
  .book-field   { background: var(--surface2); border: 1px solid var(--border); }
  .book-field label { color: var(--text2); }
  .book-field input, .book-field select { color: var(--text); }
  .book-field select option { background: var(--surface2); color: var(--text); }
  .price-summary { background: var(--surface2); border: 1px solid var(--border); }
  .price-row     { color: var(--text2); }
  .price-row.total { color: var(--text); border-top-color: var(--border); }
  .btn-secondary { background: var(--surface); border: 1.5px solid var(--border2); color: var(--text); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .booking-card  { background: var(--surface); border: 1px solid var(--border); }
  .booking-title { color: var(--text); }
  .badge-done    { background: var(--surface2); color: var(--text3); }
  .success-code  { background: var(--surface); border: 1px solid var(--border); }
  .code-label    { color: var(--text2); }
  .success-title { color: var(--text); }
  .success-sub   { color: var(--text2); }

  /* ── Dashboard ── */
  .stat-card  { background: var(--surface); border: 1px solid var(--border); }
  .stat-label { color: var(--text2); }
  .rev-label  { color: var(--text2); }
  .rev-sub    { color: var(--text2); }

  /* ── Forms ── */
  .form-label  { color: var(--text2); }
  .form-input  { background: var(--surface); border: 1.5px solid var(--border); color: var(--text); }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,160,0.1); }
  .form-input::placeholder { color: var(--text3); }
  .toggle-opt  { background: var(--surface); border: 1.5px solid var(--border); color: var(--text2); }
  .toggle-opt:hover { border-color: var(--border2); color: var(--text); }

  /* ── Profile ── */
  .profile-name  { color: var(--text); }
  .profile-email { color: var(--text2); }
  .menu-item     { border-bottom: 1px solid var(--border); }
  .menu-item:hover { background: var(--surface2); }
  .menu-icon     { background: var(--surface2); }
  .menu-title    { color: var(--text); }
  .menu-sub      { color: var(--text2); }

  /* ── Support modal ── */
  .modal-sheet         { background: var(--surface); border: 1px solid var(--border); }
  .modal-title         { color: var(--text); }
  .modal-subtitle      { color: var(--text2); }
  .modal-close         { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }
  .modal-close:hover   { color: var(--accent); border-color: var(--accent); }
  .support-label       { color: var(--text2); }
  .support-input       { background: var(--surface2); border: 1.5px solid var(--border); color: var(--text); }
  .support-input:focus { border-color: var(--accent); }
  .support-input::placeholder { color: var(--text3); }
  .support-textarea    { background: var(--surface2); border: 1.5px solid var(--border); color: var(--text); }
  .support-textarea::placeholder { color: var(--text3); }
  .cat-opt             { background: var(--surface2); border: 1.5px solid var(--border); color: var(--text2); }
  .cat-opt:hover       { border-color: var(--border2); color: var(--text); }
  .support-success-title { color: var(--text); }
  .support-success-sub   { color: var(--text2); }
`;
