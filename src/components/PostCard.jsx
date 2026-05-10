import { useState, useRef, useEffect } from "react";
import { deletePost, editPost } from "../api/post.api";
export default function PostCard({ post, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  
  const [openEdit, setOpenEdit] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  const initials = post.author
    ? post.author.slice(0, 2).toUpperCase()
    : "??";

  
  async function handleSaveEdit() {
    await editPost(post.id, {
      title,
      content,
    });

    setOpenEdit(false);
    window.location.reload()
      onEdit?.();
  }
  async function handleDelete() {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
         await deletePost(post.id);
         onDelete?.();
         window.location.reload()
         
      }
   }

  return (
    <>
      {/*  CARD */}
      <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-3">

          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
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
          <div className="ml-auto relative" ref={menuRef}>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-40 bg-white border rounded-xl shadow-lg overflow-hidden z-10">

                <button
                  onClick={() => {
                    setOpenEdit(true);   
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
                >
                  Éditer
                </button>

                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
                >
                  Supprimer
                </button>

              </div>
            )}

          </div>
        </div>

        {/* CONTENT */}
        <h3 className="text-base font-semibold text-slate-900">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
          {post.content}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex items-center gap-4 border-t pt-3">

          <button
            onClick={handleLike}
            className={`text-sm flex items-center gap-1 ${
              liked ? "text-red-500" : "text-slate-400 hover:text-red-400"
            }`}
          >
            {liked ? "❤️" : "🤍"} {likeCount}
          </button>

          <span className="text-xs text-slate-400">
            💬 {post.comments ?? 0}
          </span>

        </div>
      </div>

      {/* =MODAL EDIT =*/}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Modifier le post
            </h2>

            <input
              className="w-full border rounded-lg p-2 mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setOpenEdit(false)}
                className="px-3 py-1 rounded bg-gray-200"
              >
                Annuler
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded bg-black text-white"
              >
                Sauvegarder
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}