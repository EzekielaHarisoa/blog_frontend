import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getPosts, searchPost } from "../api/post.api";

import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function Posts() {
  const { query, title } = useOutletContext();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    try {
      setLoading(true);

      let data;

      if (query.trim() || title !== "all") {        
        data = await searchPost({
          query,
          title,
          page,
          limit: 5,
        });
      } else {
        data = await getPosts(page, 5);
      }

      setPosts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
  }, [query, title]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 400);

    return () => clearTimeout(timer);
  }, [query, title, page]);

  return (
  <div className="min-h-screen text-white relative overflow-hidden">

    {/* BACKGROUND GLOW (cohérent avec register/login) */}
    <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 relative z-10">

      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Feed
          </h1>
          <p className="text-sm text-zinc-400">
            Explore les posts de la communauté
          </p>
        </div>

        <div className="text-xs text-zinc-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          OtakuVerse
        </div>
      </div>

      {/* CREATE POST */}
      <div className="
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-4
        shadow-lg
        shadow-black/30
      ">
        <PostForm onCreated={loadPosts} />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      )}

      {/* POSTS */}
      {!loading && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                shadow-md
                hover:shadow-violet-500/10
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <PostCard post={post} refresh={loadPosts} />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-10">
          <div className="
            inline-block
            px-6 py-5
            rounded-2xl
            border border-white/10
            bg-white/5
            backdrop-blur-md
            text-zinc-400
          ">
            Aucun post trouvé
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-3 pt-4">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="
            px-4 py-2
            rounded-xl
            text-sm
            border border-white/10
            bg-white/5
            hover:bg-violet-500/10
            transition
            disabled:opacity-40
          "
        >
          Précédent
        </button>

        <div className="
          px-4 py-2
          rounded-xl
          bg-white/5
          border border-white/10
          text-sm text-zinc-300
          backdrop-blur-md
        ">
          Page {page}
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="
            px-4 py-2
            rounded-xl
            text-sm
            border border-white/10
            bg-white/5
            hover:bg-violet-500/10
            transition
          "
        >
          Suivant
        </button>

      </div>

    </div>
  </div>
);
}