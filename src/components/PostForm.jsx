import { useState } from "react";
import { createPost } from "../api/post.api";

export default function PostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setLoading(true);
      await createPost({ title, content });
      setTitle("");
      setContent("");
      onCreated?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">
           Créer un post
        </h2>
        <p className="text-sm text-zinc-500">
          Partage ton idée avec la communauté
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* TITLE */}
        <input
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-black focus:bg-white"
          placeholder="Titre..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CONTENT */}
        <textarea
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none resize-none transition focus:border-black focus:bg-white"
          rows={4}
          placeholder="Écris ton contenu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier"}
        </button>

      </form>
    </div>
  );
}