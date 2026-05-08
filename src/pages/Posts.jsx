import { useEffect, useState } from "react";
import { getPosts } from "../api/post.api";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

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

  return (
    <>
      <h1>Liste des posts</h1>

      {loading && <p>Chargement ...</p>}
      {error && <p>{error}</p>}

      {!loading &&
        posts.map((post) => (
          <div className="mb-4 p-5 border rounded" key={post.id}>
            <h3 className="card-title">{post.title}</h3>
            <p className="card-text">{post.content}</p>
          </div>
        ))}

      <div>
        <button onClick={previousPage} disabled={page === 1}>
          Précédent
        </button>

        <span>Page {page}</span>

        <button onClick={nextPage}>Suivant</button>
      </div>
    </>
  );
}