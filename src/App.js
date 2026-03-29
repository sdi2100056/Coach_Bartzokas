// ── App.js — κεντρικό αρχείο, συναρμολογεί όλα τα modules ──
import { useState } from "react";

// ── CSS imports ──
import "./css/base.css";
import "./css/layout.css";
import "./css/cards.css";
import "./css/booking.css";
import "./css/dashboard.css";
import "./css/forms.css";
import "./css/profile.css";
import "./css/support.css";

// ── Dynamic theme (dark/light CSS vars) ──
import { getThemeVars } from "./css/theme.js";

// ── i18n ──
import { t } from "./i18n";

// ── Components ──
import Icon from "./components/Icon";
import SupportModal from "./components/SupportModal";

// ── Pages ──
import HomePage        from "./pages/HomePage";
import BookingsPage    from "./pages/BookingsPage";
import DashboardPage   from "./pages/DashboardPage";
import ListingPage     from "./pages/ListingPage";
import ProfilePage     from "./pages/ProfilePage";
import DetailPage      from "./pages/DetailPage";
import BookingFormPage from "./pages/BookingFormPage";
import EditProfilePage from "./pages/EditProfilePage";

// ── Mock user (replace with real auth when ready) ──
const mockUser = { uid: "user123", email: "demo@parkshare.gr", name: "Χρήστης Demo" };

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {

  // ── Global state ──
  const [darkMode,    setDarkMode]    = useState(true);
  const [lang,        setLang]        = useState("el");   // ← NEW: "el" | "en"
  const [tab,         setTab]         = useState("home");
  const [listings,    setListings]    = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("Όλα");
  const [showSupport, setShowSupport] = useState(false);

  // ── Overlay state ──
  const [detail,  setDetail]  = useState(null);
  const [booking, setBooking] = useState(null);
  const [success, setSuccess] = useState(false);

  // ── Booking form state ──
  const [hours,    setHours]    = useState(2);
  const [bookDate, setBookDate] = useState("2026-03-29");
  const [bookTime, setBookTime] = useState("10:00");
  const [plate,    setPlate]    = useState("");

  // ── New listing form state ──
  const [listingStep, setListingStep] = useState(1);
  const [listingType, setListingType] = useState("Κλειστό γκαράζ");
  const [formData,    setFormData]    = useState({
    title: "", address: "", width: "", height: "",
    price: "", available: "", phone: "", email: "",
    features: [], keyDelivery: "",
  });
  const [emailError, setEmailError] = useState("");

  // ── Profile edit state ──
  const [profileItems, setProfileItems] = useState([
    { id: "vehicles",  icon: "car",      title: "Τα οχήματά μου",            sub: "ΑΒΓ 1234 · Golf VII",            editable: true  },
    { id: "key",       icon: "key",      title: "Παράδοση κλειδιού",          sub: "Κλειδοθήκη #A7",                 editable: true  },
    { id: "insurance", icon: "shield",   title: "Ασφαλιστική κάλυψη",         sub: "Ενεργή έως 12/2026",             editable: true  },
    { id: "payments",  icon: "euro",     title: "Πληρωμές & Χρεώσεις",        sub: "Visa •••• 4242",                 editable: true  },
    { id: "stats",     icon: "chartbar", title: "Στατιστικά",                  sub: "0 κρατήσεις · €0 εξοικονόμηση", editable: true  },
    { id: "support",   icon: "phone",    title: "Υποστήριξη 24/7",             sub: "Επικοινωνία με την ομάδα",       editable: false, isSupport: true },
    { id: "language",  icon: "globe",    title: "Γλώσσα / Language",           sub: "🇬🇷 Ελληνικά",                   editable: false, isLanguage: true },
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editProfileValue, setEditProfileValue] = useState("");
  const [editIsEmail,      setEditIsEmail]      = useState(false);
  const [editEmailError,   setEditEmailError]   = useState("");

  // ─── Helpers ─────────────────────────────────────────────────────────────

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

  // ── Language toggle ──
  const handleToggleLang = () => {
    const next = lang === "el" ? "en" : "el";
    setLang(next);
    // Update the language menu item subtitle to reflect new state
    setProfileItems(prev => prev.map(p =>
      p.id === "language"
        ? { ...p, sub: next === "el" ? "🇬🇷 Ελληνικά" : "🇬🇧 English" }
        : p
    ));
    // Also sync filter label to the new language default
    setFilter(next === "el" ? "Όλα" : "All");
  };

  // ── Booking actions ──
  const handleBook = (l) => {
    setDetail(null);
    setBooking(l);
    setSuccess(false);
  };

  const confirmBooking = () => {
    const newBooking = {
      id:      "B" + Math.floor(1000 + Math.random() * 9000),
      listing: booking.title,
      driver:  mockUser.name,
      plate:   plate || "Μη δηλωμένη",
      date:    bookDate,
      time:    `${bookTime} (${hours} ώρες)`,
      amount:  (booking.price * hours * 1.15).toFixed(2),
      status:  "upcoming",
    };
    setBookings(prev => [newBooking, ...prev]);
    setSuccess(true);
  };

  // ── Listing actions ──
  const handleAddListing = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Το email πρέπει να περιέχει @");
      return;
    }
    const newListing = {
      id:          "L" + Date.now(),
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
      owner:       mockUser.name,
      rating:      5.0,
      reviews:     0,
      userRating:  null,               // ← NEW: βαθμολογία χρήστη
      img:         listingType === "Υπαίθριος χώρος" || listingType === "Αυλή" ? "🌿" : "🏢",
      tags:        [listingType, "Νέα"],
    };
    setListings(prev => [newListing, ...prev]);
    setListingStep(1);
    setFormData({ title: "", address: "", width: "", height: "", price: "", available: "", phone: "", email: "", features: [], keyDelivery: "" });
    setEmailError("");
    setListingType("Κλειστό γκαράζ");
    setTab("home");
  };

  // ── Rating update (Feature 3) ──
  // Όταν ο χρήστης βαθμολογεί μια αγγελία από το DetailPage
  const handleRateListing = (listingId, newRating) => {
    setListings(prev => prev.map(l => {
      if (l.id !== listingId) return l;
      // Αν ο χρήστης είχε ήδη βαθμολογήσει, αντικαθιστούμε
      // Απλό μοντέλο: (oldRating * oldCount - oldUserRating + newRating) / newCount
      const oldCount      = l.reviews;
      const oldUserRating = l.userRating ?? null;
      let newCount, newAvg;
      if (oldUserRating === null) {
        // Πρώτη βαθμολογία
        newCount = oldCount + 1;
        newAvg   = ((l.rating * oldCount) + newRating) / newCount;
      } else {
        // Αλλαγή υπάρχουσας βαθμολογίας
        newCount = oldCount; // ο αριθμός κριτικών δεν αλλάζει
        newAvg   = ((l.rating * oldCount) - oldUserRating + newRating) / newCount;
      }
      return {
        ...l,
        rating:     Math.round(newAvg * 10) / 10,
        reviews:    newCount,
        userRating: newRating,
      };
    }));
    // Ενημέρωσε και το detail αν είναι ανοιχτό
    setDetail(prev => {
      if (!prev || prev.id !== listingId) return prev;
      return { ...prev, userRating: newRating };
    });
  };

  // ── Profile save ──
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

  // ── Nav click ──
  const handleNav = (id) => {
    setDetail(null);
    setBooking(null);
    setTab(id);
  };

  // ── Nav items (translated) ──
  const NAV_ITEMS = [
    { id: "home",      icon: "home",     label: t(lang, "nav_home")      },
    { id: "bookings",  icon: "calendar", label: t(lang, "nav_bookings")  },
    { id: "list",      icon: "plus",     label: t(lang, "nav_add")       },
    { id: "dashboard", icon: "chartbar", label: t(lang, "nav_dashboard") },
    { id: "profile",   icon: "user",     label: t(lang, "nav_profile")   },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
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
            />
          )}

          {tab === "bookings" && (
            <BookingsPage
              bookings={bookings}
              toggle={toggle} darkMode={darkMode}
              lang={lang}
            />
          )}

          {tab === "dashboard" && (
            <DashboardPage
              bookings={bookings}
              listings={listings}
              toggle={toggle} darkMode={darkMode}
              lang={lang}
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
              toggle={toggle} darkMode={darkMode}
              lang={lang}
            />
          )}

          {tab === "profile" && (
            <ProfilePage
              profileItems={profileItems}
              setEditingProfileId={setEditingProfileId}
              setEditProfileValue={setEditProfileValue}
              setEditIsEmail={setEditIsEmail}
              setEditEmailError={setEditEmailError}
              setShowSupport={setShowSupport}
              onToggleLang={handleToggleLang}
              lang={lang}
              toggle={toggle} darkMode={darkMode}
            />
          )}
        </div>

        {/* ── Overlays ── */}

        {detail && (
          <DetailPage
            listing={detail}
            onClose={() => setDetail(null)}
            onBook={handleBook}
            onRate={handleRateListing}
            lang={lang}
          />
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
            darkMode={darkMode}
            lang={lang}
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
            prefillName={mockUser.name}
            prefillEmail={mockUser.email}
            lang={lang}
          />
        )}

        {/* ── Navigation ── */}
        <nav className="nav">
          {NAV_ITEMS.map(n => (
            <div
              key={n.id}
              className={`nav-item ${tab === n.id ? "active" : ""}`}
              onClick={() => handleNav(n.id)}
            >
              <Icon name={n.icon} size={22} />
              {n.label}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
