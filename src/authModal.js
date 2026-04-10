import { useState } from "react";
import { registerUser, loginUser } from "./auth";

const AuthModal = ({ onClose, onSuccess }) => {
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
      onSuccess(result.user);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        width: "90%",
        maxWidth: "400px",
        position: "relative"
      }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          ✕
        </button>
        
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          {isLogin ? "Σύνδεση" : "Εγγραφή"}
        </h2>
        
        {error && (
          <div style={{
            background: "#fee",
            color: "#c00",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Ονοματεπώνυμο"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Τηλέφωνο"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          
          <input
            type="password"
            placeholder="Κωδικός"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#00c98a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px"
            }}
          >
            {loading ? "Παρακαλώ περιμένετε..." : (isLogin ? "Σύνδεση" : "Εγγραφή")}
          </button>
        </form>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            color: "#00c98a",
            marginTop: "15px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          {isLogin ? "Δεν έχεις λογαριασμό; Εγγράψου" : "Έχεις ήδη λογαριασμό; Συνδέσου"}
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box"
};

export default AuthModal;
