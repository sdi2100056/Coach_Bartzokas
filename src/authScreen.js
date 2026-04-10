import { useState } from "react";
import { registerUser, loginUser } from "./auth";

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    let result;
    if (isLogin) {
      result = await loginUser(email, password);
    } else {
      result = await registerUser(email, password, name, phone);
    }
    
    setLoading(false);
    
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  // Στυλ για το AuthScreen
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "40px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    },
    logo: {
      textAlign: "center",
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "30px",
      fontFamily: "'Syne', sans-serif"
    },
    logoGreen: {
      color: "#00c98a"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      marginBottom: "12px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "14px",
      boxSizing: "border-box",
      transition: "border-color 0.2s"
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#00c98a",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background 0.2s"
    },
    switchButton: {
      width: "100%",
      background: "none",
      border: "none",
      color: "#00c98a",
      marginTop: "15px",
      cursor: "pointer",
      fontSize: "14px",
      textAlign: "center"
    },
    error: {
      background: "#fee",
      color: "#c00",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center"
    },
    demoButton: {
      width: "100%",
      padding: "10px",
      background: "#f8f9fa",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      fontSize: "13px",
      cursor: "pointer",
      marginTop: "20px",
      color: "#666"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          Park<span style={styles.logoGreen}>Share</span>
        </div>
        
        <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "20px" }}>
          {isLogin ? "Σύνδεση" : "Δημιουργία Λογαριασμού"}
        </h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Ονοματεπώνυμο"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Τηλέφωνο"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          
          <input
            type="password"
            placeholder="Κωδικός (τουλάχιστον 6 χαρακτήρες)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => e.target.style.background = "#00b37a"}
            onMouseLeave={(e) => e.target.style.background = "#00c98a"}
          >
            {loading ? "Παρακαλώ περιμένετε..." : (isLogin ? "Σύνδεση" : "Εγγραφή")}
          </button>
        </form>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          {isLogin ? "Δεν έχεις λογαριασμό; Εγγράψου" : "Έχεις ήδη λογαριασμό; Συνδέσου"}
        </button>
        
        <button
          onClick={() => {
            // Demo login για γρήγορη δοκιμή
            setEmail("demo@parkshare.gr");
            setPassword("demo123");
          }}
          style={styles.demoButton}
        >
          🔑 Δοκιμαστικό Demo (ck271103@gmail.com / 1234567)
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
