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

    if (image) {
      formData.append("image", image);
    }

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
  <div className="rounded-2xl border border-white/10 bg-[#121826] shadow-xl p-5 text-white">

    {/* HEADER */}
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight">
        Créer un post
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Partage ton contenu avec la communauté
      </p>
    </div>

    {/* ERROR */}
    {error && (
      <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
        {error}
      </div>
    )}

    {/* SUCCESS */}
    {success && (
      <div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
        {success}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-3">

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du post..."
        className="w-full rounded-xl bg-[#0b0f19] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
      />

      {/* CONTENT */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Exprime-toi..."
        rows={4}
        className="w-full resize-none rounded-xl bg-[#0b0f19] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
      />

      {/* IMAGE UPLOAD */}
      <label className="flex flex-col items-center justify-center gap-1 cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-gray-400 hover:border-indigo-500 hover:text-gray-200 transition">
        <span className="text-sm">📷 Ajouter une image</span>
        <span className="text-xs text-gray-500">PNG, JPG, WEBP</span>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
      </label>

      {/* PREVIEW */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-64 object-cover rounded-xl border border-white/10"
          />
        </div>
      )}

      {/* BUTTON */}
      <button
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2 text-sm font-medium text-white transition active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Publication..." : "Publier"}
      </button>

    </form>
  </div>
);
}