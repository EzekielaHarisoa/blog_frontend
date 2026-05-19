import { useState } from "react";
import { createPost } from "../api/post.api";
import useAuthStore from "../store/authstore";

export default function PostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  // messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <p className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
        Accès refusé. Veuillez vous connecter.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // reset messages
    setError("");
    setSuccess("");

    // validation
    if (!title.trim() || !content.trim()) {
      setError("Le titre et le contenu sont requis.");
      return;
    }

    try {
      setLoading(true);

      await createPost({ title, content });

      setTitle("");
      setContent("");

      setSuccess("Post publié avec succès.");

      onCreated?.();

    } catch (err) {

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue.");
      }

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

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-3 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-600">
          {success}
        </div>
      )}

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
          className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-black focus:bg-white"
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