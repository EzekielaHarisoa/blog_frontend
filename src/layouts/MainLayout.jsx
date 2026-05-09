import { useNavigate, Outlet } from "react-router-dom";

export default function MainLayout() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand} onClick={() => navigate("/")}>
          <span style={styles.navLogo}>✦</span>
          <span style={styles.navTitle}>Mon Blog</span>
        </div>
        <div style={styles.navActions}>
          <button style={styles.navBtn} onClick={() => navigate("/post")}>
            Posts
          </button>
          {token && (
            <button style={{ ...styles.navBtn, ...styles.logoutBtn }} onClick={logout}>
              Déconnexion
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.heroEyebrow}>Bienvenue sur</p>
          <h2 style={styles.heroTitle}>Mon Blog</h2>
          <p style={styles.heroSub}>
            Un espace dédié à partager des articles passionnants sur la technologie,
            la santé, le voyage et bien plus encore.
          </p>
        </div>
        <div style={styles.heroDivider} />
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <div style={styles.sectionLabel}>
          <span style={styles.labelLine} />
          <span style={styles.labelText}>Articles récents</span>
          <span style={styles.labelLine} />
        </div>
        <p style={styles.sectionDesc}>
          Découvrez nos derniers articles sur la technologie, la santé, le voyage et bien plus encore.
        </p>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>© {new Date().getFullYear()} Mon Blog — Tous droits réservés</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f5f0; }

        button:hover { opacity: 0.82; transform: translateY(-1px); transition: all 0.18s ease; }
        button { transition: all 0.18s ease; cursor: pointer; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    background: "#f7f5f0",
    color: "#1a1a1a",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2.5rem",
    height: "64px",
    background: "#fff",
    borderBottom: "1px solid #e8e4dc",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    textDecoration: "none",
  },
  navLogo: {
    fontSize: "1.1rem",
    color: "#b5862a",
  },
  navTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.01em",
  },
  navActions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  navBtn: {
    background: "transparent",
    border: "1.5px solid #1a1a1a",
    color: "#1a1a1a",
    padding: "0.4rem 1.1rem",
    borderRadius: "2rem",
    fontSize: "0.875rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#1a1a1a",
    color: "#f7f5f0",
    border: "1.5px solid #1a1a1a",
  },
  hero: {
    background: "#fff",
    padding: "4rem 2.5rem 0",
  },
  heroInner: {
    maxWidth: "720px",
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "3rem",
  },
  heroEyebrow: {
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#b5862a",
    marginBottom: "0.75rem",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    marginBottom: "1.25rem",
  },
  heroSub: {
    fontSize: "1.05rem",
    color: "#555",
    lineHeight: 1.7,
    maxWidth: "540px",
    margin: "0 auto",
  },
  heroDivider: {
    height: "3px",
    background: "linear-gradient(90deg, transparent, #b5862a 40%, transparent)",
    maxWidth: "200px",
    margin: "0 auto",
    borderRadius: "2px",
  },
  main: {
    flex: 1,
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
    padding: "3rem 2rem",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.75rem",
  },
  labelLine: {
    flex: 1,
    height: "1px",
    background: "#ddd",
    display: "block",
  },
  labelText: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#999",
    whiteSpace: "nowrap",
  },
  sectionDesc: {
    fontSize: "0.95rem",
    color: "#777",
    marginBottom: "2.5rem",
    textAlign: "center",
    lineHeight: 1.6,
  },
  footer: {
    textAlign: "center",
    padding: "1.5rem",
    fontSize: "0.8rem",
    color: "#aaa",
    borderTop: "1px solid #e8e4dc",
    background: "#fff",
  },
};