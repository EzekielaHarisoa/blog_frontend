import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPosts, searchPost } from "../api/post.api";

import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function Posts() {
  const { query } = useOutletContext();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  async function loadPosts() {
    let data;

    if (query.trim()) {
      data = await searchPost(query);
    } else {
      data = await getPosts(page, 5);
    }

    setPosts(data.data);
  }

  useEffect(() => {
    loadPosts();
  }, [query, page]); 

  return (
    <>
      <PostForm onCreated={loadPosts} />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          refresh={loadPosts}
        />
      ))}

      {/* PAGINATION */}
      <div className="mt-8 flex items-center justify-center gap-4">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Précédent
        </button>

        <span className="text-sm text-slate-500">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Suivant
        </button>

      </div>
    </>
  );
}