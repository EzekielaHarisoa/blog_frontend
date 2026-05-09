import { useState } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email et mot de passe requis");
      return;
    }
    try {
      setLoading(true);
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/posts");
      alert("Login successful");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-input {
          width: 100%;
          padding: 0.85rem 1.1rem;
          border: 1.5px solid #e0dbd0;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1a1a1a;
          background: #faf9f6;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .login-input::placeholder { color: #aaa; }
        .login-input:focus {
          border-color: #b5862a;
          box-shadow: 0 0 0 3px rgba(181,134,42,0.12);
          background: #fff;
        }
        .login-btn {
          width: 100%;
          padding: 0.9rem;
          background: #1a1a1a;
          color: #f7f5f0;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.15s ease;
          letter-spacing: 0.02em;
        }
        .login-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
        }
        .login-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeIn 0.45s ease both; }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      {/* Card */}
      <div style={styles.card} className={`login-card${error ? " shake" : ""}`}>

        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>✦</span>
          <span style={styles.brandName}>Mon Blog</span>
        </div>

        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.subtitle}>Bienvenue, entrez vos identifiants pour continuer.</p>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Adresse email</label>
            <input
              className="login-input"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span style={styles.loadingRow}>
                <Spinner /> Connexion en cours…
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.75s linear infinite", display: "inline-block" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f5f0",
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem 1rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8e4dc",
    borderRadius: "18px",
    padding: "2.75rem 2.5rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    marginBottom: "1.75rem",
  },
  brandIcon: {
    color: "#b5862a",
    fontSize: "1rem",
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
    marginBottom: "0.4rem",
  },
  subtitle: {
    fontSize: "0.88rem",
    color: "#999",
    marginBottom: "1.75rem",
    lineHeight: 1.5,
  },
  errorBox: {
    background: "#fdf0ee",
    border: "1px solid #f5c6c0",
    color: "#c0392b",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    marginBottom: "1.25rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#555",
    letterSpacing: "0.03em",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
};