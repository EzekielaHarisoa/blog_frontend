import { useState } from "react";
import { createPost } from "../api/post.api";
import useAuthStore from "../store/authstore";

export default function PostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Accès refusé. Connecte-toi pour publier.
      </div>
    );
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim()) {
      setError("Titre et contenu obligatoires.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await createPost(formData);

      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);

      setSuccess("✨ Post publié avec succès !");
      onCreated?.();

    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-5 text-white">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Créer un post
        </h2>
        <p className="text-sm text-zinc-400">
          Partage ton univers
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-3 rounded-xl bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
        />

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris ton contenu..."
          rows={4}
          className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
        />

        {/* IMAGE UPLOAD */}
        <label className="block cursor-pointer rounded-xl border border-dashed border-zinc-600 p-3 text-center text-sm text-zinc-400 hover:border-violet-500">
          📷 Ajouter une image
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-60 object-cover rounded-xl border border-zinc-700"
          />
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier"}
        </button>

      </form>
    </div>
  );
}