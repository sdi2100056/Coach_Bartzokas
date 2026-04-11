// ── App.js — κεντρικό αρχείο, συναρμολογεί όλα τα modules ──
import { useState, useEffect } from "react";

// ── CSS imports ──
import "./css/base.css";
import "./css/layout.css";
import "./css/cards.css";
import "./css/booking.css";
import "./css/dashboard.css";
import "./css/forms.css";
import "./css/profile.css";
import "./css/support.css";
import AuthScreen from "./authScreen";

// ── Dynamic theme (dark/light CSS vars) ──
import { getThemeVars } from "./css/theme.js";

// ── i18n ──
import { t } from "./i18n";

import { onAuthChange, logout } from "./firebase";
import { getListings, addListing, getUserBookings, addBooking, getOwnerBookings } from "./firestore";

// ── Components ──
import Icon from "./components/Icon";
import SupportModal from "./components/SupportModal";
import ChatbotWidget from "./components/ChatbotWidget.js";   // ← ΝΕΟ
import AuthModal     from "./authModal";

// ── Pages ──
import HomePage        from "./pages/HomePage";
import BookingsPage    from "./pages/BookingsPage";
import DashboardPage   from "./pages/DashboardPage";
import ListingPage     from "./pages/ListingPage";
import ProfilePage     from "./pages/ProfilePage";
import DetailPage      from "./pages/DetailPage";
import BookingFormPage from "./pages/BookingFormPage";
import EditProfilePage from "./pages/EditProfilePage";

export default function App() {

  const [currentUser,   setCurrentUser]   = useState(null);
  const [authLoading,   setAuthLoading]   = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [darkMode,      setDarkMode]      = useState(true);
  const [lang,          setLang]          = useState("el");
  const [tab,           setTab]           = useState("home");
  const [listings,      setListings]      = useState([]);
  const [bookings,      setBookings]      = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("Όλα");
  const [showSupport,   setShowSupport]   = useState(false);
  const [dbLoading,     setDbLoading]     = useState(false);

  const [detail,  setDetail]  = useState(null);
  const [booking, setBooking] = useState(null);
  const [success, setSuccess] = useState(false);

  const [hours,    setHours]    = useState(2);
  const [bookDate, setBookDate] = useState("2026-03-29");
  const [bookTime, setBookTime] = useState("10:00");
  const [plate,    setPlate]    = useState("");

  const [listingStep, setListingStep] = useState(1);
  const [listingType, setListingType] = useState("Κλειστό γκαράζ");
  const [formData,    setFormData]    = useState({
    title: "", address: "", width: "", height: "",
    price: "", available: "", phone: "", email: "",
    features: [], keyDelivery: "",
  });
  const [emailError, setEmailError] = useState("");

  const [profileItems, setProfileItems] = useState([
    { id: "vehicles",  icon: "car",      title: "Τα οχήματά μου",         sub: "ΑΒΓ 1234 · Golf VII",            editable: true  },
    { id: "key",       icon: "key",      title: "Παράδοση κλειδιού",       sub: "Κλειδοθήκη #A7",                 editable: true  },
    { id: "insurance", icon: "shield",   title: "Ασφαλιστική κάλυψη",      sub: "Ενεργή έως 12/2026",             editable: true  },
    { id: "payments",  icon: "euro",     title: "Πληρωμές & Χρεώσεις",     sub: "Visa •••• 4242",                 editable: true  },
    { id: "stats",     icon: "chartbar", title: "Στατιστικά",               sub: "0 κρατήσεις · €0 εξοικονόμηση", editable: true  },
    { id: "support",   icon: "phone",    title: "Υποστήριξη 24/7",          sub: "Επικοινωνία με την ομάδα",       editable: false, isSupport: true },
    { id: "language",  icon: "globe",    title: "Γλώσσα / Language",        sub: "🇬🇷 Ελληνικά",                   editable: false, isLanguage: true },
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editProfileValue, setEditProfileValue] = useState("");
  const [editIsEmail,      setEditIsEmail]      = useState(false);
  const [editEmailError,   setEditEmailError]   = useState("");

  useEffect(() => {
  logout().then(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        await loadAllData(user.uid);
      } else {
        setListings([]);
        setBookings([]);
        setOwnerBookings([]);
      }
    });
    // ✅ Επιστρέφουμε το unsubscribe σωστά
    return () => unsubscribe();
  });
}, []);

  const loadAllData = async (uid) => {
    setDbLoading(true);
    try {
      const [allListings, userBkgs, ownerBkgs] = await Promise.all([
        getListings(),
        getUserBookings(uid),
        getOwnerBookings(uid),
      ]);
      setListings(allListings);
      setBookings(userBkgs);
      setOwnerBookings(ownerBkgs);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setDbLoading(false);
    }
  };

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
        : [...prev.features, feat],
    }));
  };

  const handleToggleLang = () => {
    const next = lang === "el" ? "en" : "el";
    setLang(next);
    setProfileItems(prev => prev.map(p =>
      p.id === "language" ? { ...p, sub: next === "el" ? "🇬🇷 Ελληνικά" : "🇬🇧 English" } : p
    ));
    setFilter(next === "el" ? "Όλα" : "All");
  };

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    await loadAllData(user.uid);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setListings([]);
    setBookings([]);
    setOwnerBookings([]);
    setTab("home");
  };

  const handleBook = (l) => {
    if (!currentUser) { setShowAuthModal(true); return; }
    setDetail(null);
    setBooking(l);
    setSuccess(false);
  };

  const confirmBooking = async () => {
    if (!currentUser || !booking) return;
    const newBooking = {
      listingId: booking.id,
      listing:   booking.title,
      driverUid: currentUser.uid,
      driver:    currentUser.displayName || currentUser.email,
      ownerUid:  booking.ownerUid,
      plate:     plate || "Μη δηλωμένη",
      date:      bookDate,
      time:      `${bookTime} (${hours} ώρες)`,
      hours:     hours,
      amount:    (booking.price * hours * 1.15).toFixed(2),
    };
    try {
      const id = await addBooking(newBooking);
      setBookings(prev => [{ id, ...newBooking, status: "upcoming" }, ...prev]);
      setSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  const handleAddListing = async () => {
    if (!currentUser) { setShowAuthModal(true); return; }
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Το email πρέπει να περιέχει @");
      return;
    }
    const newListing = {
      title:       formData.title   || "Νέα Θέση",
      address:     formData.address || "-",
      type:        listingType,
      width:       formData.width   || "-",
      height:      formData.height  || "-",
      price:       Number(formData.price) || 0,
      priceUnit:   "ώρα",
      available:   formData.available || "-",
      phone:       formData.phone   || "-",
      email:       formData.email   || "-",
      features:    formData.features,
      keyDelivery: formData.keyDelivery,
      ownerUid:    currentUser.uid,
      owner:       currentUser.displayName || currentUser.email,
      img:         listingType === "Υπαίθριος χώρος" || listingType === "Αυλή" ? "🌿" : "🏢",
      tags:        [listingType, "Νέα"],
    };
    try {
      const id = await addListing(newListing);
      setListings(prev => [{ id, ...newListing, rating: 5.0, reviews: 0 }, ...prev]);
      setListingStep(1);
      setFormData({ title: "", address: "", width: "", height: "", price: "", available: "", phone: "", email: "", features: [], keyDelivery: "" });
      setEmailError("");
      setListingType("Κλειστό γκαράζ");
      setTab("home");
    } catch (err) {
      console.error("Listing error:", err);
    }
  };

  const handleSaveProfile = () => {
    if (editIsEmail && editProfileValue && !validateEmail(editProfileValue)) {
      setEditEmailError("Το email πρέπει να περιέχει @");
      return;
    }
    setProfileItems(prev =>
      prev.map(p => p.id === editingProfileId ? { ...p, sub: editProfileValue } : p)
    );
    setEditingProfileId(null);
  };

  const handleNav = (id) => {
    if (!currentUser && ["bookings", "list", "dashboard", "profile"].includes(id)) {
      setShowAuthModal(true);
      return;
    }
    setDetail(null);
    setBooking(null);
    setTab(id);
  };

  const NAV_ITEMS = [
    { id: "home",      icon: "home",     label: t(lang, "nav_home")      },
    { id: "bookings",  icon: "calendar", label: t(lang, "nav_bookings")  },
    { id: "list",      icon: "plus",     label: t(lang, "nav_add")       },
    { id: "dashboard", icon: "chartbar", label: t(lang, "nav_dashboard") },
    { id: "profile",   icon: "user",     label: t(lang, "nav_profile")   },
  ];

  // Φόρτωση
  if (authLoading) {
    return (
      <>
        <style>{getThemeVars(darkMode)}</style>
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "var(--bg)", gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>🅿️</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>ParkShare</div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>Φόρτωση...</div>
        </div>
      </>
    );
  }

  // Αν δεν είναι συνδεδεμένος → αρχική οθόνη login
  if (!currentUser) {
    return (
      <>
        <style>{getThemeVars(darkMode)}</style>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{getThemeVars(darkMode)}</style>

      <div className="app">
        <div className="page-wrapper">

          {tab === "home" && (
            <HomePage
              listings={listings}
              search={search}   setSearch={setSearch}
              filter={filter}   setFilter={setFilter}
              setDetail={setDetail}
              toggle={toggle}   darkMode={darkMode}
              lang={lang}
              currentUser={currentUser}
              onLoginClick={() => setShowAuthModal(true)}
              dbLoading={dbLoading}
            />
          )}

          {tab === "bookings" && (
            <BookingsPage bookings={bookings} toggle={toggle} darkMode={darkMode} lang={lang} />
          )}

          {tab === "dashboard" && (
            <DashboardPage
              bookings={ownerBookings}
              listings={listings.filter(l => l.ownerUid === currentUser?.uid)}
              toggle={toggle} darkMode={darkMode} lang={lang}
            />
          )}

          {tab === "list" && (
            <ListingPage
              listingStep={listingStep} setListingStep={setListingStep}
              listingType={listingType} setListingType={setListingType}
              formData={formData}
              handleFormChange={handleFormChange}
              toggleFeature={toggleFeature}
              emailError={emailError}
              handleAddListing={handleAddListing}
              toggle={toggle} darkMode={darkMode} lang={lang}
            />
          )}

          {tab === "profile" && (
            <ProfilePage
              profileItems={profileItems}
              currentUser={currentUser}
              setEditingProfileId={setEditingProfileId}
              setEditProfileValue={setEditProfileValue}
              setEditIsEmail={setEditIsEmail}
              setEditEmailError={setEditEmailError}
              setShowSupport={setShowSupport}
              onToggleLang={handleToggleLang}
              onLogout={handleLogout}
              lang={lang}
              toggle={toggle} darkMode={darkMode}
            />
          )}
        </div>

       {detail && (
  <DetailPage listing={detail} onClose={() => setDetail(null)} onBook={handleBook} lang={lang} />
)}

        {booking && (
          <BookingFormPage
            listing={booking}
            hours={hours}       setHours={setHours}
            bookDate={bookDate} setBookDate={setBookDate}
            bookTime={bookTime} setBookTime={setBookTime}
            plate={plate}       setPlate={setPlate}
            success={success}
            onConfirm={confirmBooking}
            onClose={() => { setBooking(null); setSuccess(false); }}
            onGoToBookings={() => { setBooking(null); setSuccess(false); setTab("bookings"); }}
            darkMode={darkMode} lang={lang}
          />
        )}

        {editingProfileId && (
          <EditProfilePage
            item={profileItems.find(i => i.id === editingProfileId)}
            editProfileValue={editProfileValue}
            setEditProfileValue={setEditProfileValue}
            editIsEmail={editIsEmail}
            editEmailError={editEmailError}
            setEditEmailError={setEditEmailError}
            onSave={handleSaveProfile}
            onClose={() => setEditingProfileId(null)}
            lang={lang}
          />
        )}

        {showSupport && (
          <SupportModal
            onClose={() => setShowSupport(false)}
            prefillName={currentUser?.displayName || ""}
            prefillEmail={currentUser?.email || ""}
            lang={lang}
          />
        )}

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <ChatbotWidget lang={lang} />

        <nav className="nav">
          {NAV_ITEMS.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => handleNav(n.id)}>
              <Icon name={n.icon} size={22} />
              {n.label}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
