import { useState } from "react";
import { createPost } from "../api/post.api";
import useAuthStore from "../store/authstore";
import { Image, Send, XCircle, FileText } from "lucide-react";

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
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
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

  function removeImage() {
    setImage(null);
    setPreview(null);
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

      setSuccess("Post publié !");
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1424] shadow-lg p-4 text-white">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <FileText size={16} /> Nouveau post
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Partage une idée avec la communauté
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <XCircle size={16} />
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre..."
          className="w-full rounded-xl bg-[#0b0f19] border border-white/10 px-3 py-2 text-sm outline-none focus:border-violet-500"
        />

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quoi de neuf ?"
          rows={4}
          className="w-full resize-none rounded-xl bg-[#0b0f19] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-500"
        />

        {/* IMAGE UPLOAD */}
        <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 py-3 text-sm text-zinc-400 hover:text-white hover:border-violet-500 transition">
          <Image size={16} />
          Ajouter une image
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
              className="w-full max-h-60 object-cover rounded-xl border border-white/10"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-red-500/60"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? "Publication..." : "Publier"}
        </button>

      </form>
    </div>
  );
}