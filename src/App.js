import { useState } from "react";

const mockUser = { uid: "user123", email: "demo@parkshare.gr", name: "Χρήστης Demo" };

const Icon = ({ name, size = 20 }) => {
  const icons = {
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    car: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><polyline points="5 9 2 9 2 5"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    euro: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    key: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>,
    chartbar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    warning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    headset: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  };
  return icons[name] || null;
};

const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent:  #00c98a;
    --accent2: #0099ff;
    --accent3: #ff6b35;
    --radius:  16px;
    --radius-sm: 10px;
  }
  body { font-family:'DM Sans',sans-serif; min-height:100vh; overflow-x:hidden; transition:background .3s,color .3s; }
  .app { display:flex; flex-direction:column; min-height:100vh; width:100%; transition:background .3s; }
  .page-wrapper { width:100%; }
  .nav { position:fixed; bottom:0; left:0; width:100%; backdrop-filter:blur(20px); display:flex; z-index:100; padding:8px 0 4px; transition:background .3s; }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:8px 4px; cursor:pointer; transition:color .2s; font-family:'Syne',sans-serif; font-size:10px; font-weight:500; letter-spacing:.5px; }
  .nav-item svg { transition:transform .2s; }
  .nav-item.active svg { transform:translateY(-2px); }
  @media (min-width:768px) {
    .nav { top:0; bottom:auto; justify-content:center; gap:8px; padding:0 40px; height:60px; }
    .nav-item { flex-direction:row; gap:8px; padding:8px 20px; border-radius:10px; font-size:13px; flex:unset; }
    .nav-item.active svg { transform:none; }
    .page-wrapper { padding-top:60px; }
    .section { padding:20px 60px 0; }
    .h-scroll { padding:4px 60px; margin:0 -60px; }
    .stats-grid { margin:0 60px 20px; grid-template-columns:repeat(4,1fr); }
    .page { top:60px; height:calc(100vh - 60px); left:0; transform:none; width:100%; }
  }
  .theme-toggle { width:38px; height:38px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; flex-shrink:0; }
  .theme-toggle:hover { transform:rotate(20deg); }
  .top-bar { display:flex; justify-content:space-between; align-items:center; padding:20px 20px 16px; }
  @media (min-width:768px) { .top-bar { padding:30px 60px 16px; } }
  .logo { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; letter-spacing:-1px; }
  .search-wrap { position:relative; margin:0 20px 16px; }
  @media (min-width:768px) { .search-wrap { margin:0 60px 16px; } }
  .search-input { width:100%; border-radius:var(--radius); padding:14px 16px 14px 48px; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; transition:border-color .2s; }
  .search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); }
  .filters { display:flex; gap:8px; overflow-x:auto; padding:0 20px 8px; scrollbar-width:none; }
  @media (min-width:768px) { .filters { padding:0 60px 8px; } }
  .filters::-webkit-scrollbar { display:none; }
  .filter-chip { padding:8px 16px; border-radius:50px; font-family:'Syne',sans-serif; font-size:12px; font-weight:600; white-space:nowrap; cursor:pointer; transition:all .2s; }
  .filter-chip.active { background:var(--accent); border-color:var(--accent); color:#fff; }
  .section { padding:20px 20px 0; }
  .section-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; }
  .card { border-radius:var(--radius); overflow:hidden; cursor:pointer; transition:transform .2s,box-shadow .2s; margin-bottom:12px; }
  .card:hover { transform:translateY(-2px); }
  .card-emoji { height:140px; display:flex; align-items:center; justify-content:center; font-size:64px; position:relative; }
  .card-tag { position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.5); backdrop-filter:blur(10px); border-radius:50px; padding:4px 10px; font-size:11px; font-family:'Syne',sans-serif; font-weight:600; color:var(--accent); }
  .card-body { padding:14px; }
  .card-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:4px; }
  .card-addr { font-size:12px; margin-bottom:8px; }
  .card-row { display:flex; justify-content:space-between; align-items:center; }
  .card-rating { display:flex; align-items:center; gap:4px; font-size:13px; color:#f59e0b; }
  .card-price { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
  .card-price span { font-size:11px; font-weight:400; }
  .h-scroll { display:flex; gap:12px; overflow-x:auto; padding:4px 20px; margin:0 -20px; scrollbar-width:none; }
  .h-scroll::-webkit-scrollbar { display:none; }
  .hcard { min-width:200px; border-radius:var(--radius); overflow:hidden; cursor:pointer; flex-shrink:0; transition:transform .2s; }
  .hcard:hover { transform:translateY(-2px); }
  .hcard-emoji { height:100px; display:flex; align-items:center; justify-content:center; font-size:48px; }
  .hcard-body { padding:10px 12px; }
  .hcard-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; margin-bottom:2px; }
  .hcard-price { font-size:12px; color:var(--accent); font-weight:600; }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0 20px 20px; }
  .stat-card { border-radius:var(--radius); padding:16px; }
  .stat-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--accent); }
  .stat-label { font-size:12px; margin-top:2px; }
  .page { position:fixed; top:0; left:0; width:100%; height:100vh; z-index:200; overflow-y:auto; animation:slideUp .3s ease; padding-bottom:100px; transition:background .3s; }
  @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
  .detail-hero { height:220px; display:flex; align-items:center; justify-content:center; font-size:100px; position:relative; }
  .back-btn { position:absolute; top:16px; left:16px; width:40px; height:40px; border-radius:50%; backdrop-filter:blur(10px); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .detail-body { padding:20px; }
  .detail-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:4px; }
  .detail-addr { font-size:14px; margin-bottom:16px; }
  .detail-price { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; color:var(--accent); margin-bottom:20px; }
  .detail-price span { font-size:14px; font-weight:400; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
  .info-item { border-radius:var(--radius-sm); padding:12px; }
  .info-label { font-size:11px; margin-bottom:4px; font-family:'Syne',sans-serif; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }
  .info-val { font-size:14px; font-weight:500; }
  .tags-wrap { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px; }
  .tag { padding:6px 12px; background:rgba(0,201,138,0.1); border:1px solid rgba(0,201,138,0.3); border-radius:50px; font-size:12px; color:var(--accent); font-family:'Syne',sans-serif; font-weight:600; }
  .owner-row { display:flex; align-items:center; gap:12px; padding:16px; border-radius:var(--radius); margin-bottom:20px; }
  .owner-ava { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,var(--accent2),var(--accent)); display:flex; align-items:center; justify-content:center; font-size:20px; }
  .owner-name { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; }
  .owner-since { font-size:12px; }
  .book-section { border-radius:var(--radius); padding:20px; margin-bottom:16px; }
  .book-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .book-row { display:flex; gap:10px; margin-bottom:10px; }
  .book-field { flex:1; border-radius:var(--radius-sm); padding:12px; }
  .book-field label { font-size:10px; font-family:'Syne',sans-serif; font-weight:600; letter-spacing:.5px; text-transform:uppercase; display:block; margin-bottom:4px; }
  .book-field input,.book-field select { background:transparent; border:none; font-family:'DM Sans',sans-serif; font-size:14px; width:100%; outline:none; }
  .price-summary { border-radius:var(--radius-sm); padding:14px; }
  .price-row { display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px; }
  .price-row.total { font-weight:700; font-family:'Syne',sans-serif; font-size:15px; border-top-width:1px; border-top-style:solid; padding-top:8px; margin-top:8px; }
  .btn { width:100%; padding:16px; border-radius:var(--radius); border:none; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { filter:brightness(1.1); transform:translateY(-1px); }
  .booking-card { border-radius:var(--radius); padding:16px; margin-bottom:10px; }
  .booking-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .booking-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; }
  .badge { padding:4px 10px; border-radius:50px; font-size:11px; font-family:'Syne',sans-serif; font-weight:700; }
  .badge-active { background:rgba(0,201,138,0.15); color:var(--accent); }
  .badge-upcoming { background:rgba(0,153,255,0.15); color:var(--accent2); }
  .badge-done { color:#888; }
  .booking-amount { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:var(--accent); }
  .success-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 30px; text-align:center; min-height:60vh; }
  .success-icon { width:80px; height:80px; border-radius:50%; background:rgba(0,201,138,0.15); display:flex; align-items:center; justify-content:center; margin-bottom:24px; border:2px solid var(--accent); }
  .success-title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; margin-bottom:8px; }
  .success-sub { font-size:15px; line-height:1.6; margin-bottom:32px; }
  .success-code { border-radius:var(--radius); padding:20px; width:100%; margin-bottom:24px; }
  .code-label { font-size:11px; margin-bottom:4px; font-family:'Syne',sans-serif; }
  .code-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; letter-spacing:4px; color:var(--accent); }
  .revenue-card { background:linear-gradient(135deg,rgba(0,201,138,0.12),rgba(0,153,255,0.08)); border:1px solid rgba(0,201,138,0.2); border-radius:var(--radius); padding:24px; margin-bottom:16px; }
  .rev-label { font-size:12px; margin-bottom:6px; font-family:'Syne',sans-serif; }
  .rev-val { font-family:'Syne',sans-serif; font-size:40px; font-weight:800; color:var(--accent); }
  .rev-sub { font-size:13px; margin-top:4px; }
  .form-section { margin-bottom:20px; }
  .form-label { font-size:12px; font-family:'Syne',sans-serif; font-weight:600; letter-spacing:.5px; text-transform:uppercase; display:block; margin-bottom:8px; }
  .form-input { width:100%; border-radius:var(--radius-sm); padding:13px 16px; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color .2s; }
  .form-input:focus { border-color:var(--accent); }
  .toggle-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .toggle-opt { padding:12px; border-radius:var(--radius-sm); cursor:pointer; text-align:center; font-family:'Syne',sans-serif; font-size:12px; font-weight:600; transition:all .2s; }
  .toggle-opt.sel { border-color:var(--accent); background:rgba(0,201,138,0.1); color:var(--accent); }
  .map-placeholder { height:180px; border-radius:var(--radius); margin-bottom:16px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px; font-size:13px; }
  .profile-header { padding:72px 20px 24px; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; }
  .profile-ava { width:88px; height:88px; border-radius:50%; background:linear-gradient(135deg,var(--accent2),var(--accent)); display:flex; align-items:center; justify-content:center; font-size:36px; margin-bottom:14px; border:3px solid var(--accent); }
  .profile-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; }
  .profile-email { font-size:13px; margin-top:4px; }
  .profile-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(0,201,138,0.1); border:1px solid rgba(0,201,138,0.3); border-radius:50px; padding:6px 14px; margin-top:10px; font-size:12px; color:var(--accent); font-family:'Syne',sans-serif; font-weight:700; }
  .menu-item { display:flex; align-items:center; gap:14px; padding:16px 20px; cursor:pointer; transition:background .2s; }
  .menu-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--accent); }
  .menu-text { flex:1; }
  .menu-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:600; }
  .menu-sub { font-size:12px; }
  .pb-nav { padding-bottom:80px; }
  @media (min-width:768px) { .pb-nav { padding-bottom:20px; } }

  /* ── SUPPORT MODAL ── */
  .modal-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px);
    z-index:500; display:flex; align-items:flex-end; justify-content:center;
    animation:fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-sheet {
    width:100%; max-width:560px; border-radius:24px 24px 0 0; padding:28px 24px 40px;
    animation:sheetUp .3s cubic-bezier(.16,1,.3,1);
    max-height:90vh; overflow-y:auto;
  }
  @media (min-width:768px) {
    .modal-backdrop { align-items:center; }
    .modal-sheet { border-radius:24px; max-height:80vh; }
  }
  @keyframes sheetUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-handle { width:40px; height:4px; border-radius:2px; background:rgba(128,128,128,0.3); margin:0 auto 20px; }
  .modal-header { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .modal-icon { width:48px; height:48px; border-radius:14px; background:rgba(0,201,138,0.12); border:1px solid rgba(0,201,138,0.25); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
  .modal-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; }
  .modal-subtitle { font-size:12px; margin-top:2px; }
  .modal-close { margin-left:auto; width:36px; height:36px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .support-field { margin-bottom:14px; }
  .support-label { font-size:11px; font-family:'Syne',sans-serif; font-weight:700; letter-spacing:.6px; text-transform:uppercase; display:block; margin-bottom:6px; }
  .support-input {
    width:100%; border-radius:var(--radius-sm); padding:12px 14px;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:border-color .2s; resize:none;
  }
  .support-input:focus { border-color:var(--accent); }
  .support-input.error { border-color:var(--accent3) !important; }
  .support-textarea {
    width:100%; border-radius:var(--radius-sm); padding:12px 14px;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
    transition:border-color .2s; resize:none;
    min-height:80px; max-height:160px; overflow-y:auto;
  }
  .support-textarea:focus { border-color:var(--accent); }
  .error-hint { font-size:11px; color:var(--accent3); margin-top:4px; display:flex; align-items:center; gap:4px; }
  .category-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
  .cat-opt { padding:10px 12px; border-radius:var(--radius-sm); cursor:pointer; text-align:center; font-family:'Syne',sans-serif; font-size:12px; font-weight:600; transition:all .2s; }
  .cat-opt.sel { border-color:var(--accent); background:rgba(0,201,138,0.1); color:var(--accent); }
  .support-success { display:flex; flex-direction:column; align-items:center; text-align:center; padding:20px 0 10px; }
  .support-success-icon { width:64px; height:64px; border-radius:50%; background:rgba(0,201,138,0.12); border:2px solid var(--accent); display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:var(--accent); }
  .support-success-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; margin-bottom:8px; }
  .support-success-sub { font-size:14px; line-height:1.6; }
  .ticket-badge { display:inline-block; margin-top:12px; padding:8px 16px; border-radius:50px; background:rgba(0,201,138,0.1); border:1px solid rgba(0,201,138,0.3); font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--accent); letter-spacing:1px; }
`;

const getThemeVars = (dark) => `
  :root {
    --bg:      ${dark ? "#0a0f1e" : "#f4f6fb"};
    --surface: ${dark ? "#111827" : "#ffffff"};
    --surface2:${dark ? "#1a2235" : "#eef1f7"};
    --surface3:${dark ? "#212d42" : "#e4e8f2"};
    --border:  ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    --text:    ${dark ? "#f0f4ff" : "#0d1526"};
    --text2:   ${dark ? "#8895b0" : "#5a6a85"};
    --text3:   ${dark ? "#4a5568" : "#aab4c8"};
    --shadow:  ${dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)"};
    --nav-bg:  ${dark ? "rgba(17,24,39,0.97)" : "rgba(255,255,255,0.97)"};
    --back-btn-bg: ${dark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)"};
  }
  body { background:var(--bg); color:var(--text); }
  .app { background:var(--bg); }
  .nav { background:var(--nav-bg); border-top:1px solid var(--border); }
  @media (min-width:768px) { .nav { border-top:none; border-bottom:1px solid var(--border); } }
  .nav-item { color:var(--text3); }
  .nav-item.active { color:var(--accent); }
  @media (min-width:768px) { .nav-item.active { background:rgba(0,201,138,0.1); } }
  .theme-toggle { border:1px solid var(--border); background:var(--surface2); color:var(--text2); }
  .theme-toggle:hover { background:var(--surface3); color:var(--accent); }
  .search-input { background:var(--surface); border:1px solid var(--border); color:var(--text); }
  .search-input:focus { border-color:var(--accent); }
  .search-input::placeholder { color:var(--text3); }
  .search-icon { color:var(--text3); }
  .filter-chip { border:1px solid var(--border); background:var(--surface); color:var(--text2); }
  .card { background:var(--surface); border:1px solid var(--border); box-shadow:none; }
  .card:hover { box-shadow:var(--shadow); }
  .card-title { color:var(--text); }
  .card-addr { color:var(--text2); }
  .card-price { color:var(--text); }
  .card-price span { color:var(--text2); }
  .hcard { background:var(--surface); border:1px solid var(--border); }
  .hcard-emoji { background:var(--surface2); }
  .hcard-title { color:var(--text); }
  .stat-card { background:var(--surface); border:1px solid var(--border); }
  .stat-label { color:var(--text2); }
  .section-title { color:var(--text); }
  .page { background:var(--bg); }
  .back-btn { background:var(--back-btn-bg); color:var(--text); }
  .detail-hero { background:var(--surface2); }
  .detail-title { color:var(--text); }
  .detail-addr { color:var(--text2); }
  .detail-price span { color:var(--text2); }
  .info-item { background:var(--surface); border:1px solid var(--border); }
  .info-label { color:var(--text2); }
  .info-val { color:var(--text); }
  .owner-row { background:var(--surface); border:1px solid var(--border); }
  .owner-name { color:var(--text); }
  .owner-since { color:var(--text2); }
  .map-placeholder { background:var(--surface); border:1px solid var(--border); color:var(--text2); }
  .book-section { background:var(--surface); border:1px solid var(--border); }
  .book-title { color:var(--text); }
  .book-field { background:var(--surface2); border:1px solid var(--border); }
  .book-field label { color:var(--text2); }
  .book-field input,.book-field select { color:var(--text); }
  .book-field select option { background:var(--surface2); color:var(--text); }
  .price-summary { background:var(--surface2); }
  .price-row { color:var(--text2); }
  .price-row.total { color:var(--text); border-top-color:var(--border); }
  .btn-secondary { background:var(--surface); border:1px solid var(--border); color:var(--text); }
  .booking-card { background:var(--surface); border:1px solid var(--border); }
  .booking-title { color:var(--text); }
  .badge-done { background:var(--surface2); }
  .success-code { background:var(--surface); border:1px solid var(--border); }
  .code-label { color:var(--text2); }
  .success-title { color:var(--text); }
  .success-sub { color:var(--text2); }
  .rev-label { color:var(--text2); }
  .rev-sub { color:var(--text2); }
  .form-label { color:var(--text2); }
  .form-input { background:var(--surface); border:1px solid var(--border); color:var(--text); }
  .form-input::placeholder { color:var(--text3); }
  .toggle-opt { background:var(--surface); border:2px solid var(--border); color:var(--text2); }
  .profile-name { color:var(--text); }
  .profile-email { color:var(--text2); }
  .menu-item { border-bottom:1px solid var(--border); }
  .menu-item:hover { background:var(--surface2); }
  .menu-icon { background:var(--surface2); }
  .menu-title { color:var(--text); }
  .menu-sub { color:var(--text2); }
  .logo { color:var(--text); }
  .modal-sheet { background:var(--surface); }
  .modal-title { color:var(--text); }
  .modal-subtitle { color:var(--text2); }
  .modal-close { background:var(--surface2); border:1px solid var(--border); color:var(--text2); }
  .modal-close:hover { color:var(--accent); }
  .support-label { color:var(--text2); }
  .support-input { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .support-input::placeholder { color:var(--text3); }
  .support-textarea { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .support-textarea::placeholder { color:var(--text3); }
  .cat-opt { background:var(--surface2); border:2px solid var(--border); color:var(--text2); }
  .support-success-title { color:var(--text); }
  .support-success-sub { color:var(--text2); }
`;

// ── SUPPORT MODAL ─────────────────────────────────────────────────────────────
function SupportModal({ onClose, darkMode, prefillName, prefillEmail }) {
  const [step, setStep] = useState("form"); // "form" | "success"
  const [category, setCategory] = useState("");
  const [name, setName] = useState(prefillName || "");
  const [email, setEmail] = useState(prefillEmail || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const categories = ["Κράτηση", "Πληρωμή", "Τεχνικό", "Άλλο"];

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Απαιτείται όνομα";
    if (!email.trim()) e.email = "Απαιτείται email";
    else if (!validateEmail(email)) e.email = "Το email πρέπει να περιέχει @";
    if (!category) e.category = "Επίλεξε κατηγορία";
    if (!subject.trim()) e.subject = "Απαιτείται θέμα";
    if (!message.trim()) e.message = "Γράψε το πρόβλημά σου";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setStep("success");
  };

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
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={onClose}>
              Κλείσιμο
            </button>
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

            {/* Message — scrollable textarea */}
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

// ── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("home");
  const [detail, setDetail] = useState(null);
  const [booking, setBooking] = useState(null);
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState("Όλα");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showSupport, setShowSupport] = useState(false);

  const [hours, setHours] = useState(2);
  const [bookDate, setBookDate] = useState("2026-03-25");
  const [bookTime, setBookTime] = useState("10:00");
  const [plate, setPlate] = useState("");

  const [listingStep, setListingStep] = useState(1);
  const [listingType, setListingType] = useState("Κλειστό γκαράζ");
  const [formData, setFormData] = useState({
    title: "", address: "", width: "", height: "", price: "",
    available: "", phone: "", email: "", features: [], keyDelivery: ""
  });
  const [emailError, setEmailError] = useState("");

  const [profileItems, setProfileItems] = useState([
    { id: "vehicles", icon: "car", title: "Τα οχήματά μου", sub: "ΑΒΓ 1234 · Golf VII", editable: true },
    { id: "key", icon: "key", title: "Παράδοση κλειδιού", sub: "Κλειδοθήκη #A7", editable: true },
    { id: "insurance", icon: "shield", title: "Ασφαλιστική κάλυψη", sub: "Ενεργή έως 12/2026", editable: true },
    { id: "payments", icon: "euro", title: "Πληρωμές & Χρεώσεις", sub: "Visa •••• 4242", editable: true },
    { id: "stats", icon: "chartbar", title: "Στατιστικά", sub: "0 κρατήσεις · €0 εξοικονόμηση", editable: true },
    { id: "support", icon: "phone", title: "Υποστήριξη 24/7", sub: "Επικοινωνία με την ομάδα", editable: false, isSupport: true },
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editProfileValue, setEditProfileValue] = useState("");
  const [editIsEmail, setEditIsEmail] = useState(false);
  const [editEmailError, setEditEmailError] = useState("");

  const toggle = () => setDarkMode(d => !d);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "email") {
      if (value && !validateEmail(value)) setEmailError("Το email πρέπει να περιέχει @");
      else setEmailError("");
    }
  };

  const toggleFeature = (feat) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter(f => f !== feat)
        : [...prev.features, feat]
    }));
  };

  const filters = ["Όλα", "Κοντά μου", "Αεροδρόμιο", "Κλειστά", "Airport"];
  const filtered = listings.filter(l => {
    const m = (l.title || "").toLowerCase().includes(search.toLowerCase()) || (l.address || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "Κλειστά") return m && l.type === "Κλειστό γκαράζ";
    if (filter === "Airport") return m && (l.tags || []).includes("Αεροδρόμιο");
    return m;
  });

  const handleBook = (l) => { setDetail(null); setBooking(l); setSuccess(false); };

  const confirmBooking = () => {
    const newBooking = {
      id: "B" + Math.floor(1000 + Math.random() * 9000),
      listing: booking.title,
      driver: mockUser.name,
      plate: plate || "Μη δηλωμένη",
      date: bookDate,
      time: `${bookTime} (${hours} ώρες)`,
      amount: (booking.price * hours * 1.15).toFixed(2),
      status: "upcoming"
    };
    setBookings(prev => [newBooking, ...prev]);
    setSuccess(true);
  };

  const handleAddListing = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Το email πρέπει να περιέχει @");
      return;
    }
    const newListing = {
      id: "L" + Date.now(),
      title: formData.title || "Νέα Θέση",
      address: formData.address || "-",
      type: listingType,
      width: formData.width || "-",
      height: formData.height || "-",
      price: Number(formData.price) || 0,
      priceUnit: "ώρα",
      available: formData.available || "-",
      phone: formData.phone || "-",
      email: formData.email || "-",
      features: formData.features,
      keyDelivery: formData.keyDelivery,
      owner: mockUser.name,
      rating: 5.0,
      reviews: 0,
      img: listingType === "Υπαίθριος χώρος" || listingType === "Αυλή" ? "🌿" : "🏢",
      tags: [listingType, "Νέα"],
    };
    setListings(prev => [newListing, ...prev]);
    setListingStep(1);
    setFormData({ title: "", address: "", width: "", height: "", price: "", available: "", phone: "", email: "", features: [], keyDelivery: "" });
    setEmailError("");
    setListingType("Κλειστό γκαράζ");
    setTab("home");
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2);
  const totalHours = bookings.reduce((sum, b) => {
    const match = b.time.match(/\((\d+) ώρε/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
  const avgPrice = listings.length > 0
    ? (listings.reduce((s, l) => s + l.price, 0) / listings.length).toFixed(2)
    : "0";

  // ── HOME ──
  const renderHome = () => (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Park<span style={{color:"var(--accent)"}}>Share</span></div>
        <button className="theme-toggle" onClick={toggle}><Icon name={darkMode ? "sun" : "moon"} size={18} /></button>
      </div>
      <div className="search-wrap">
        <div className="search-icon"><Icon name="search" size={18} /></div>
        <input className="search-input" placeholder="Πού θέλεις να παρκάρεις;" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="filters">
        {filters.map(f => <div key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</div>)}
      </div>
      <div className="section" style={{ marginTop: 8 }}>
        <div className="section-title">⭐ Πρόσφατες θέσεις</div>
      </div>
      {listings.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text2)", fontSize: "14px" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          Η βάση είναι άδεια!<br />Πήγαινε στο μενού <strong>"Πρόσθεσε"</strong> για να ανεβάσεις την πρώτη αγγελία.
        </div>
      ) : (
        <>
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
                    <div className="card-rating"><Icon name="star" size={13} />{l.rating}<span style={{color:"var(--text2)"}} className="card-reviews">({l.reviews} κριτικές)</span></div>
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

  // ── BOOKINGS ──
  const renderBookings = () => (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Κρατήσεις<span style={{ color: "var(--accent)" }}>μου</span></div>
        <button className="theme-toggle" onClick={toggle}><Icon name={darkMode ? "sun" : "moon"} size={18} /></button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>Ιστορικό & ενεργές κρατήσεις</div>
        {bookings.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text2)", fontSize: "14px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
            Δεν έχεις καμία κράτηση ακόμα!<br />Βρες μια θέση από την Αρχική για να ξεκινήσεις.
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-top">
                <div>
                  <div className="booking-title">{b.listing}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>#{b.id} · {b.driver}</div>
                </div>
                <div className={`badge badge-${b.status === "active" ? "active" : b.status === "upcoming" ? "upcoming" : "done"}`}>
                  {b.status === "active" ? "🟢 Ενεργή" : b.status === "upcoming" ? "🔵 Επερχόμενη" : "✅ Ολοκλ."}
                </div>
              </div>
              <div style={{ marginBottom: 10, display: "flex", gap: 16, fontSize: 12, color: "var(--text2)", flexWrap: "wrap" }}>
                <span>🚗 {b.plate}</span><span>📅 {b.date}</span><span>⏰ {b.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>Σύνολο</div>
                <div className="booking-amount">€{b.amount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── DASHBOARD ──
  const renderDashboard = () => (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Dashboard <span style={{ color: "var(--accent)" }}>Ιδ/τη</span></div>
        <button className="theme-toggle" onClick={toggle}><Icon name={darkMode ? "sun" : "moon"} size={18} /></button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>Γεια σου, {mockUser.name.split(" ")[0]} 👋</div>
        <div className="revenue-card">
          <div className="rev-label">Συνολικά Έσοδα</div>
          <div className="rev-val">€ {totalRevenue}</div>
          <div className="rev-sub">{bookings.length === 0 ? "Δεν υπάρχουν κρατήσεις ακόμα" : `Από ${bookings.length} κράτηση${bookings.length === 1 ? "" : "εις"}`}</div>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { val: bookings.length, label: "Κρατήσεις συνολικά" },
          { val: listings.length > 0 ? "4.9" : "—", label: "Μέση βαθμολογία" },
          { val: totalHours > 0 ? `${totalHours}ω` : "0ω", label: "Συνολικές ώρες" },
          { val: listings.length > 0 ? `€${avgPrice}` : "€0", label: "Μέση τιμή / ώρα" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="section-title" style={{ marginBottom: 12 }}>📋 Επερχόμενες Κρατήσεις</div>
        {bookings.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)", fontSize: "13px" }}>
            Δεν υπάρχουν νέες κρατήσεις για τις θέσεις σου.
          </div>
        ) : (
          bookings.filter(b => b.status !== "completed").map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-top">
                <div>
                  <div className="booking-title">{b.driver}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{b.plate} · {b.time}</div>
                </div>
                <div className={`badge badge-${b.status === "active" ? "active" : "upcoming"}`}>
                  {b.status === "active" ? "🟢 Τώρα" : "🔵 Σύντομα"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>📅 {b.date}</div>
                <div className="booking-amount">+€{b.amount}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── LISTING ──
  const renderListing = () => (
    <div className="pb-nav">
      <div className="top-bar">
        <div className="logo">Νέα <span style={{ color: "var(--accent)" }}>Θέση</span></div>
        <button className="theme-toggle" onClick={toggle}><Icon name={darkMode ? "sun" : "moon"} size={18} /></button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 12 }}>Βήμα {listingStep} από 3</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map(s => <div key={s} style={{ height: 4, flex: 1, borderRadius: 2, background: s <= listingStep ? "var(--accent)" : "var(--surface2)", transition: "background .3s" }} />)}
        </div>

        {listingStep === 1 && <>
          <div className="form-section">
            <label className="form-label">Τίτλος θέσης</label>
            <input className="form-input" placeholder="π.χ. Γκαράζ Κολωνάκι" value={formData.title} onChange={e => handleFormChange("title", e.target.value)} />
          </div>
          <div className="form-section">
            <label className="form-label">Διεύθυνση</label>
            <input className="form-input" placeholder="Οδός, Αριθμός, Περιοχή" value={formData.address} onChange={e => handleFormChange("address", e.target.value)} />
          </div>
          <div className="form-section">
            <label className="form-label">Τύπος χώρου</label>
            <div className="toggle-grid">{["Κλειστό γκαράζ", "Υπαίθριος χώρος", "Υπόγειο", "Αυλή"].map(t => <div key={t} className={`toggle-opt ${listingType === t ? "sel" : ""}`} onClick={() => setListingType(t)}>{t}</div>)}</div>
          </div>
          <div className="form-section">
            <label className="form-label">Διαστάσεις (προαιρετικό)</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input className="form-input" placeholder="Πλάτος" value={formData.width} onChange={e => handleFormChange("width", e.target.value)} />
              <input className="form-input" placeholder="Ύψος" value={formData.height} onChange={e => handleFormChange("height", e.target.value)} />
            </div>
          </div>
        </>}

        {listingStep === 2 && <>
          <div className="form-section">
            <label className="form-label">Τιμή ανά ώρα (€)</label>
            <input className="form-input" type="number" placeholder="π.χ. 2.50" value={formData.price} onChange={e => handleFormChange("price", e.target.value)} />
          </div>
          <div className="form-section">
            <label className="form-label">Ώρες διαθεσιμότητας</label>
            <input className="form-input" placeholder="π.χ. 08:00 – 22:00" value={formData.available} onChange={e => handleFormChange("available", e.target.value)} />
          </div>
          <div className="form-section">
            <label className="form-label">Χαρακτηριστικά</label>
            <div className="toggle-grid">
              {["Κάμερα", "Φωτισμός", "Φόρτιση", "ΑΜΕΑ"].map(t => (
                <div key={t} className={`toggle-opt ${formData.features.includes(t) ? "sel" : ""}`} onClick={() => toggleFeature(t)}>{t}</div>
              ))}
            </div>
          </div>
        </>}

        {listingStep === 3 && <>
          <div className="form-section">
            <label className="form-label">Τρόπος παράδοσης κλειδιού</label>
            <div className="toggle-grid">
              {["Προσωπικά", "Κλειδοθήκη", "Smart Lock", "Γείτονας"].map(t => (
                <div key={t} className={`toggle-opt ${formData.keyDelivery === t ? "sel" : ""}`} onClick={() => handleFormChange("keyDelivery", t)}>{t}</div>
              ))}
            </div>
          </div>
          <div className="form-section">
            <label className="form-label">Επικοινωνία</label>
            <input className="form-input" placeholder="Κινητό τηλέφωνο" style={{ marginBottom: 8 }} value={formData.phone} onChange={e => handleFormChange("phone", e.target.value)} />
            <input
              className={`form-input${emailError ? " error" : ""}`}
              style={{ border: emailError ? "1px solid var(--accent3)" : undefined }}
              placeholder="Email (υποχρεωτικό @)"
              value={formData.email}
              onChange={e => handleFormChange("email", e.target.value)}
            />
            {emailError && <div style={{ fontSize: 11, color: "var(--accent3)", marginTop: 4 }}>⚠ {emailError}</div>}
          </div>
          <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", gap: 10 }}>
            <Icon name="warning" size={16} /><div style={{ fontSize: 12, color: "var(--accent3)", lineHeight: 1.5 }}>Βεβαιώσου ότι επιτρέπεται από τον κανονισμό της πολυκατοικίας σου η εκμίσθωση.</div>
          </div>
        </>}

        <div style={{ display: "flex", gap: 10 }}>
          {listingStep > 1 && <button className="btn btn-secondary" style={{ maxWidth: 100 }} onClick={() => setListingStep(s => s - 1)}>← Πίσω</button>}
          <button className="btn btn-primary" onClick={() => listingStep < 3 ? setListingStep(s => s + 1) : handleAddListing()}>
            {listingStep < 3 ? "Επόμενο →" : "✅ Δημοσίευση"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── PROFILE ──
  const renderProfile = () => (
    <div className="pb-nav">
      <div className="profile-header">
        <button className="theme-toggle" style={{ position: "absolute", top: 16, right: 20 }} onClick={toggle}><Icon name={darkMode ? "sun" : "moon"} size={18} /></button>
        <div className="profile-ava">{mockUser.name.charAt(0)}</div>
        <div className="profile-name">{mockUser.name}</div>
        <div className="profile-email">{mockUser.email}</div>
        <div className="profile-badge"><Icon name="shield" size={13} /> Επαληθευμένος χρήστης</div>
      </div>
      {profileItems.map((item) => (
        <div
          key={item.id}
          className="menu-item"
          onClick={() => {
            if (item.isSupport) {
              setShowSupport(true);
            } else if (item.editable) {
              setEditingProfileId(item.id);
              setEditProfileValue(item.sub);
              const isEmailField = item.id === "payments";
              setEditIsEmail(isEmailField);
              setEditEmailError("");
            }
          }}
        >
          <div className="menu-icon"><Icon name={item.icon} size={18} /></div>
          <div className="menu-text">
            <div className="menu-title">{item.title}</div>
            <div className="menu-sub">{item.sub}</div>
          </div>
          <Icon name="arrow" size={16} />
        </div>
      ))}
      <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <button style={{ background: "transparent", border: "none", color: "var(--accent3)", fontFamily: "'Syne',sans-serif", fontWeight: "700", cursor: "pointer" }}>Αποσύνδεση</button>
      </div>
    </div>
  );

  // ── EDIT PROFILE OVERLAY ──
  const renderEditProfile = () => {
    const item = profileItems.find(i => i.id === editingProfileId);
    if (!item) return null;

    const handleSave = () => {
      if (editIsEmail && editProfileValue && !validateEmail(editProfileValue)) {
        setEditEmailError("Το email πρέπει να περιέχει @");
        return;
      }
      setProfileItems(prev => prev.map(p => p.id === item.id ? { ...p, sub: editProfileValue } : p));
      setEditingProfileId(null);
    };

    return (
      <div className="page" style={{ zIndex: 300 }}>
        <div style={{ padding: "72px 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
          <button className="back-btn" style={{ position: "relative", top: 0, left: 0, background: "var(--surface)" }} onClick={() => setEditingProfileId(null)}>
            <Icon name="close" size={18} />
          </button>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Επεξεργασία</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>{item.title}</div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="form-section">
            <label className="form-label">Νέα καταχώρηση για {item.title}</label>
            {/* scrollable textarea for long values */}
            <textarea
              className="form-input"
              style={{
                resize: "none",
                minHeight: 80,
                maxHeight: 160,
                overflowY: "auto",
                border: editEmailError ? "1px solid var(--accent3)" : undefined,
              }}
              value={editProfileValue}
              onChange={e => {
                setEditProfileValue(e.target.value);
                if (editIsEmail) {
                  if (e.target.value && !validateEmail(e.target.value)) setEditEmailError("Το email πρέπει να περιέχει @");
                  else setEditEmailError("");
                }
              }}
              autoFocus
              rows={3}
            />
            {editEmailError && <div style={{ fontSize: 11, color: "var(--accent3)", marginTop: 4 }}>⚠ {editEmailError}</div>}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>
            <Icon name="check" size={18} /> Αποθήκευση αλλαγών
          </button>
        </div>
      </div>
    );
  };

  // ── DETAIL ──
  const renderDetail = (l) => (
    <div className="page">
      <div className="detail-hero">{l.img}<button className="back-btn" onClick={() => setDetail(null)}><Icon name="close" size={18} /></button></div>
      <div className="detail-body">
        <div className="tags-wrap">{(l.tags || []).map(t => <div key={t} className="tag">{t}</div>)}</div>
        <div className="detail-title">{l.title}</div>
        <div className="detail-addr">📍 {l.address}</div>
        <div className="detail-price">€{l.price} <span>/{l.priceUnit}</span></div>
        <div className="info-grid">
          <div className="info-item"><div className="info-label">Τύπος</div><div className="info-val">{l.type}</div></div>
          <div className="info-item"><div className="info-label">Διαθεσιμότητα</div><div className="info-val">{l.available}</div></div>
          <div className="info-item"><div className="info-label">Πλάτος</div><div className="info-val">{l.width}</div></div>
          <div className="info-item"><div className="info-label">Παράδοση Κλειδιού</div><div className="info-val">{l.keyDelivery || "-"}</div></div>
        </div>
        {l.features && l.features.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="info-label" style={{ marginBottom: 8 }}>Χαρακτηριστικά</div>
            <div className="tags-wrap">
              {l.features.map(f => <div key={f} className="tag" style={{ background: "var(--surface2)", color: "var(--text)", border: "none" }}>{f}</div>)}
            </div>
          </div>
        )}
        <div className="owner-row">
          <div className="owner-ava">🏠</div>
          <div><div className="owner-name">{l.owner}</div><div className="owner-since">Μέλος από το 2026</div></div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4, color: "#f59e0b", fontSize: 13, alignItems: "center" }}><Icon name="star" size={13} />{l.rating}<span style={{ color: "var(--text2)" }}>({l.reviews})</span></div>
        </div>
        <div className="map-placeholder"><Icon name="map" size={28} /><span>Χάρτης περιοχής</span></div>
        <button className="btn btn-primary" onClick={() => handleBook(l)}><Icon name="calendar" size={18} /> Κράτηση τώρα</button>
      </div>
    </div>
  );

  // ── BOOKING FORM ──
  const renderBookingForm = (l) => (
    <div className="page">
      <div style={{ padding: "72px 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
        <button className="back-btn" style={{ position: "relative", top: 0, left: 0, background: "var(--surface)" }} onClick={() => setBooking(null)}><Icon name="close" size={18} /></button>
        <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Κράτηση</div><div style={{ fontSize: 12, color: "var(--text2)" }}>{l.title}</div></div>
      </div>
      {success ? (
        <div className="success-screen">
          <div className="success-icon"><Icon name="check" size={36} /></div>
          <div className="success-title">Κράτηση επιβεβαιώθηκε! 🎉</div>
          <div className="success-sub">Ο ιδιοκτήτης θα επικοινωνήσει μαζί σου για την παράδοση του κλειδιού.</div>
          <div className="success-code"><div className="code-label">Κωδικός κράτησης</div><div className="code-val">PK-{Math.floor(1000 + Math.random() * 9000)}</div></div>
          <button className="btn btn-primary" onClick={() => { setBooking(null); setSuccess(false); setTab("bookings"); }}>Δες τις κρατήσεις μου</button>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <div className="book-section">
            <div className="book-title"><Icon name="calendar" size={16} /> Ημερομηνία & ώρα</div>
            <div className="book-row">
              <div className="book-field">
                <label>Ημερομηνία</label>
                <input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} style={{ colorScheme: darkMode ? "dark" : "light" }} />
              </div>
            </div>
            <div className="book-row">
              <div className="book-field">
                <label>Ώρα έναρξης</label>
                <select value={bookTime} onChange={(e) => setBookTime(e.target.value)}>
                  <option value="10:00">10:00</option><option value="11:00">11:00</option>
                  <option value="12:00">12:00</option><option value="14:00">14:00</option>
                </select>
              </div>
              <div className="book-field">
                <label>Διάρκεια</label>
                <select onChange={e => setHours(Number(e.target.value))} value={hours}>
                  {[1,2,3,4,6,8,12,24].map(h => <option key={h} value={h}>{h} ώρ{h === 1 ? "α" : "ες"}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="book-section">
            <div className="book-title"><Icon name="car" size={16} /> Στοιχεία οχήματος</div>
            <div className="book-field">
              <label>Πινακίδα κυκλοφορίας</label>
              <input placeholder="π.χ. ΑΒΓ 1234" value={plate} onChange={(e) => setPlate(e.target.value)} />
            </div>
          </div>
          <div className="price-summary">
            <div className="price-row"><span>€{l.price} × {hours} ώρ{hours === 1 ? "α" : "ες"}</span><span>€{(l.price * hours).toFixed(2)}</span></div>
            <div className="price-row"><span>Προμήθεια πλατφόρμας (15%)</span><span>€{(l.price * hours * 0.15).toFixed(2)}</span></div>
            <div className="price-row total"><span>Σύνολο</span><span>€{(l.price * hours * 1.15).toFixed(2)}</span></div>
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,201,138,0.08)", borderRadius: 10, border: "1px solid rgba(0,201,138,0.2)", display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <Icon name="key" size={16} /><div style={{ fontSize: 12, color: "var(--text2)" }}>Το κλειδί παραδίδεται <strong style={{ color: "var(--text)" }}>{l.keyDelivery || "προσωπικά"}</strong> από τον ιδιοκτήτη.</div>
          </div>
          <button className="btn btn-primary" onClick={confirmBooking}><Icon name="lock" size={18} /> Πληρωμή & Επιβεβαίωση</button>
          <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 10 }}>🔒 Ασφαλής πληρωμή · Δωρεάν ακύρωση έως 24ω πριν</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{BASE_STYLES}</style>
      <style>{getThemeVars(darkMode)}</style>

      <div className="app">
        <div className="page-wrapper">
          {tab === "home" && renderHome()}
          {tab === "bookings" && renderBookings()}
          {tab === "dashboard" && renderDashboard()}
          {tab === "list" && renderListing()}
          {tab === "profile" && renderProfile()}
        </div>
        {detail && renderDetail(detail)}
        {booking && renderBookingForm(booking)}
        {editingProfileId && renderEditProfile()}

        {/* ── SUPPORT MODAL ── */}
        {showSupport && (
          <SupportModal
            onClose={() => setShowSupport(false)}
            darkMode={darkMode}
            prefillName={mockUser.name}
            prefillEmail={mockUser.email}
          />
        )}

        <nav className="nav">
          {[
            { id: "home", icon: "home", label: "Αρχική" },
            { id: "bookings", icon: "calendar", label: "Κρατήσεις" },
            { id: "list", icon: "plus", label: "Πρόσθεσε" },
            { id: "dashboard", icon: "chartbar", label: "Dashboard" },
            { id: "profile", icon: "user", label: "Προφίλ" },
          ].map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => { setDetail(null); setBooking(null); setTab(n.id); }}>
              <Icon name={n.icon} size={22} />{n.label}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}