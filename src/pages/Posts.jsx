import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getPosts, searchPost } from "../api/post.api";

import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function Posts() {

  const { query, category } = useOutletContext();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  async function loadPosts() {

    try {

      let data;

      // RECHERCHE
      if (query.trim()) {

        data = await searchPost({
          query,
          category,
          page,
          limit: 5
        });

      }

      // POSTS NORMAUX
      else {

        data = await getPosts(page, 5);

      }

      setPosts(data.data);

    } catch (error) {

      console.log(error);

    }

  }

  // RESET PAGE SI RECHERCHE CHANGE
  useEffect(() => {

    setPage(1);

  }, [query, category]);

  // LOAD POSTS
  useEffect(() => {

    const timer = setTimeout(() => {

      loadPosts();

    }, 400);

    return () => clearTimeout(timer);

  }, [query, category, page]);

 return (
  <div className="min-h-screen bg-[#0b0f19] text-white">

    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* HEADER FEED */}
      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-lg font-semibold tracking-tight">
          Feed
        </h1>

        <span className="text-xs text-gray-400">
          Réseau social
        </span>

      </div>

      {/* CREATE POST */}
      <div className="mb-6">
        <PostForm onCreated={loadPosts} />
      </div>

      {/* POSTS */}
      <div className="space-y-4">

        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-white/10 bg-[#121826] shadow-md hover:border-white/20 transition"
          >
            <PostCard post={post} refresh={loadPosts} />
          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {posts.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            Aucun post trouvé
          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-10 flex items-center justify-center gap-3">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Précédent
        </button>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
          Page {page}
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          Suivant
        </button>

      </div>

    </div>
  </div>
);
}