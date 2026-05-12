import { useState, useRef, useEffect } from "react";
import { deletePost, editPost } from "../api/post.api";
import Comments from "./Comments";

export default function PostCard({ post, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [openEdit, setOpenEdit] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const menuRef = useRef(null);

  // TOKEN
  const token = localStorage.getItem("token");

  let currentUserId = null;

  
  if (token) {
   
    try {
      const user = JSON.parse(atob(token.split(".")[1]));
       

      currentUserId = Number(user.id);

    } catch (err) {
      console.error("Token invalide :", err);
    }
  }
    console.log("author_id :", post.user_id);
    console.log("currentUserId :", currentUserId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  
  function handleLike() {
    setLiked((prevLiked) => {

      setLikeCount((prevCount) =>
        prevLiked ? prevCount - 1 : prevCount + 1
      );

      return !prevLiked;
    });
  }

  
  const initials = post.author
    ? post.author.slice(0, 2).toUpperCase()
    : "??";

  async function handleSaveEdit() {
    try {
      setError("");
      setSuccess("");

      if (!title.trim() || !content.trim()) {
        setError("Tous les champs sont requis.");
        return;
      }

      setLoading(true);

      await editPost(post.id, {
        title,
        content,
      });

      setSuccess("Post modifié avec succès.");

      setOpenEdit(false);

      onEdit?.();

    } catch (err) {

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la modification.");
      }

    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setError("");
    setSuccess("");

    if (Number(post.author_id) !== currentUserId) {
      setError(
        "Vous n'avez pas la permission de supprimer ce post."
      );
      return;
    }

    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce post ?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await deletePost(post.id);

      setSuccess("Post supprimé avec succès.");

      onDelete?.();

    } catch (err) {

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la suppression.");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">

        {error && (
          <div className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-600">
            {success}
          </div>
        )}

        <div className="mb-3 flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {initials}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              {post.author || "Anonyme"}
            </p>

            <p className="text-xs text-slate-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>

         {/* MENU */}
<div className="relative ml-auto" ref={menuRef}>

  {Number(post.user_id) === Number(currentUserId) && (
    <>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
      >
        ⋮
      </button>

      {/* DROPDOWN */}
      {menuOpen && (
        <div className="absolute right-0 top-10 z-10 w-40 overflow-hidden rounded-xl border bg-white shadow-lg">

          <button
            onClick={() => {
              setOpenEdit(true);
              setMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Éditer
          </button>

          <button
            onClick={() => {
              handleDelete();
              setMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
          >
            Supprimer
          </button>

        </div>
      )}
    </>
  )}
</div>
        </div>

        {/* CONTENT */}
        <h3 className="text-base font-semibold text-slate-900">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {post.content}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex items-center gap-4 border-t pt-3">

          {/* LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm ${
              liked
                ? "text-red-500"
                : "text-slate-400 hover:text-red-400"
            }`}
          >
            {liked ? "❤️" : "🤍"} {likeCount}
          </button>

          {/* COMMENTS */}
          <button
             onClick={() => setShowComments((prev) => !prev)}
             className="text-xs text-slate-400 hover:text-slate-600"
          >
                💬 {post.comments ?? 0}
          </button>

        </div>
          {showComments && (
  <div className="mt-3 border-t pt-3">
    <Comments postId={post.id} />
  </div>
)}
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">

            <h2 className="mb-4 text-lg font-semibold">
              Modifier le post
            </h2>

            {/* ERROR */}
            {error && (
              <div className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* TITLE */}
            <input
              className="mb-3 w-full rounded-lg border p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre..."
            />

            {/* CONTENT */}
            <textarea
              className="mb-4 w-full rounded-lg border p-2"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu..."
            />

            <div className="flex justify-end gap-2">

              <button
                disabled={loading}
                onClick={() => setOpenEdit(false)}
                className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                disabled={loading}
                onClick={handleSaveEdit}
                className="rounded bg-black px-3 py-1 text-white disabled:opacity-50"
              >
                {loading
                  ? "Sauvegarde..."
                  : "Sauvegarder"}
              </button>

            </div>

          </div>
        </div>
      )}
    
    </>
  );
}
