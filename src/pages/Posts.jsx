import { useEffect, useState } from "react";
import { getPosts } from "../api/post.api";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");
        const data = await getPosts(page, limit);
        setPosts(data.data);
      } catch (error) {
        setError("Impossible de charger les posts");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [page, limit]);

  function nextPage() {
    setPage((p) => p + 1);
  }

  function previousPage() {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }

  return (
    <div style={styles.wrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .post-card {
          background: #fff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          padding: 1.75rem 2rem;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .post-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }
        .page-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: 1.5px solid #1a1a1a;
          color: #1a1a1a;
          padding: 0.5rem 1.25rem;
          border-radius: 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .page-btn:hover:not(:disabled) {
          background: #1a1a1a;
          color: #f7f5f0;
        }
        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .logout-btn {
          background: transparent;
          border: 1.5px solid #c0392b;
          color: #c0392b;
          padding: 0.45rem 1.2rem;
          border-radius: 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .logout-btn:hover {
          background: #c0392b;
          color: #fff;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton {
          animation: pulse 1.4s ease-in-out infinite;
          background: #e8e4dc;
          border-radius: 8px;
        }
      `}</style>

      {/* Header row */}
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>✦ Journal</p>
          <h1 style={styles.title}>Liste des posts</h1>
        </div>
        <button className="logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠</span> {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={styles.list}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={styles.skeletonCard}>
              <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: "80%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {!loading && (
        <div style={styles.list}>
          {posts.length === 0 && !error && (
            <p style={styles.empty}>Aucun article trouvé pour cette page.</p>
          )}
          {posts.map((post, i) => (
            <div className="post-card" key={post.id}>
              <div style={styles.cardMeta}>
                <span style={styles.cardIndex}>#{(page - 1) * limit + i + 1}</span>
              </div>
              <h3 style={styles.cardTitle}>{post.title}</h3>
              <p style={styles.cardContent}>{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={styles.pagination}>
        <button className="page-btn" onClick={previousPage} disabled={page === 1}>
          ← Précédent
        </button>
        <span style={styles.pageIndicator}>Page {page}</span>
        <button className="page-btn" onClick={nextPage}>
          Suivant →
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a1a",
    maxWidth: "760px",
    margin: "0 auto",
    padding: "2rem 1rem 4rem",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "2.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  eyebrow: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#b5862a",
    marginBottom: "0.4rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#1a1a1a",
  },
  errorBox: {
    background: "#fdf0ee",
    border: "1px solid #f5c6c0",
    color: "#c0392b",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorIcon: {
    fontSize: "1rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    marginBottom: "2.5rem",
  },
  skeletonCard: {
    background: "#fff",
    border: "1px solid #e8e4dc",
    borderRadius: "12px",
    padding: "1.75rem 2rem",
  },
  cardMeta: {
    marginBottom: "0.6rem",
  },
  cardIndex: {
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    color: "#b5862a",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "0.65rem",
    lineHeight: 1.3,
  },
  cardContent: {
    fontSize: "0.95rem",
    color: "#555",
    lineHeight: 1.7,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    fontSize: "0.95rem",
    padding: "3rem 0",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.25rem",
  },
  pageIndicator: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#888",
    minWidth: "60px",
    textAlign: "center",
  },
};