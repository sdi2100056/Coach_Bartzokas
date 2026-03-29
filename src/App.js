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

// ── Nav items ──
const NAV_ITEMS = [
  { id: "home",      icon: "home",     label: "Αρχική"    },
  { id: "bookings",  icon: "calendar", label: "Κρατήσεις" },
  { id: "list",      icon: "plus",     label: "Πρόσθεσε"  },
  { id: "dashboard", icon: "chartbar", label: "Dashboard"  },
  { id: "profile",   icon: "user",     label: "Προφίλ"    },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {

  // ── Global state ──
  const [darkMode,     setDarkMode]     = useState(true);
  const [tab,          setTab]          = useState("home");
  const [listings,     setListings]     = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [filter,       setFilter]       = useState("Όλα");
  const [showSupport,  setShowSupport]  = useState(false);

  // ── Overlay state ──
  const [detail,       setDetail]       = useState(null);  // listing being viewed
  const [booking,      setBooking]      = useState(null);  // listing being booked
  const [success,      setSuccess]      = useState(false); // booking confirmed

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
    features: [], keyDelivery: ""
  });
  const [emailError, setEmailError] = useState("");

  // ── Profile edit state ──
  const [profileItems, setProfileItems] = useState([
    { id: "vehicles",  icon: "car",      title: "Τα οχήματά μου",       sub: "ΑΒΓ 1234 · Golf VII",       editable: true  },
    { id: "key",       icon: "key",      title: "Παράδοση κλειδιού",     sub: "Κλειδοθήκη #A7",            editable: true  },
    { id: "insurance", icon: "shield",   title: "Ασφαλιστική κάλυψη",    sub: "Ενεργή έως 12/2026",        editable: true  },
    { id: "payments",  icon: "euro",     title: "Πληρωμές & Χρεώσεις",   sub: "Visa •••• 4242",            editable: true  },
    { id: "stats",     icon: "chartbar", title: "Στατιστικά",             sub: "0 κρατήσεις · €0 εξοικονόμηση", editable: true },
    { id: "support",   icon: "phone",    title: "Υποστήριξη 24/7",        sub: "Επικοινωνία με την ομάδα",  editable: false, isSupport: true },
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
        : [...prev.features, feat]
    }));
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
      title:       formData.title    || "Νέα Θέση",
      address:     formData.address  || "-",
      type:        listingType,
      width:       formData.width    || "-",
      height:      formData.height   || "-",
      price:       Number(formData.price) || 0,
      priceUnit:   "ώρα",
      available:   formData.available || "-",
      phone:       formData.phone    || "-",
      email:       formData.email    || "-",
      features:    formData.features,
      keyDelivery: formData.keyDelivery,
      owner:       mockUser.name,
      rating:      5.0,
      reviews:     0,
      img:         listingType === "Υπαίθριος χώρος" || listingType === "Αυλή" ? "🌿" : "🏢",
      tags:        [listingType, "Νέα"],
    };
    setListings(prev => [newListing, ...prev]);
    // Reset form
    setListingStep(1);
    setFormData({ title: "", address: "", width: "", height: "", price: "", available: "", phone: "", email: "", features: [], keyDelivery: "" });
    setEmailError("");
    setListingType("Κλειστό γκαράζ");
    setTab("home");
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

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* Google Fonts — loaded via <link>, NOT inside a JS expression */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Dynamic theme variables (dark / light) */}
      <style>{getThemeVars(darkMode)}</style>

      <div className="app">
        <div className="page-wrapper">

          {/* ── Main tabs ── */}
          {tab === "home" && (
            <HomePage
              listings={listings}
              search={search}   setSearch={setSearch}
              filter={filter}   setFilter={setFilter}
              setDetail={setDetail}
              toggle={toggle}   darkMode={darkMode}
            />
          )}

          {tab === "bookings" && (
            <BookingsPage
              bookings={bookings}
              toggle={toggle} darkMode={darkMode}
            />
          )}

          {tab === "dashboard" && (
            <DashboardPage
              bookings={bookings}
              listings={listings}
              toggle={toggle} darkMode={darkMode}
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
              toggle={toggle} darkMode={darkMode}
            />
          )}
        </div>

        {/* ── Overlays (rendered on top of any tab) ── */}

        {detail && (
          <DetailPage
            listing={detail}
            onClose={() => setDetail(null)}
            onBook={handleBook}
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
          />
        )}

        {showSupport && (
          <SupportModal
            onClose={() => setShowSupport(false)}
            prefillName={mockUser.name}
            prefillEmail={mockUser.email}
          />
        )}

        {/* ── Bottom / top navigation ── */}
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
