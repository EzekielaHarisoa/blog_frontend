import { useState, useRef, useEffect } from "react";
import { deletePost, editPost } from "../api/post.api";
import Comments from "./Comments";
import { MessageCircle,Heart } from "lucide-react";
import { likePost } from "../api/like.api";
import useAuthStore from "../store/authstore";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, onEdit, onDelete }) {
  const navigate = useNavigate();  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  // TOKEN
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  let currentUserId = null;

  
  if (token) {
   
    try {
       
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

useEffect(() => {
  setLikeCount(Number(post.likes_count || 0));
  setCommentsCount(Number(post.comments_count || 0));
  setLiked(post.liked);
}, [post]);

  //like post
 async function handleLike() {
  try {
    const res = await likePost(post.id);

    setLiked(res.liked);
    setLikeCount(res.likesCount);

  } catch (error) {
    console.error("Erreur like :", error);
  }
}

  
  const initials = post.author
    ? post.author.slice(0, 2).toUpperCase()
    : "??";
  const avatar = post.avatar || getAvatarUrl(post.avatar);  

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
  //delete post
  async function handleDelete(id) {
    setError("");
    setSuccess("");

    if (Number(post.user_id) !== currentUserId) {
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

  async function handleDelete(id) {
    setError("");
    setSuccess("");

    if (Number(post.user_id) !== currentUserId) {
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
      
      setPosts((prev) => prev.filter((post) => post.id !== id));
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

          {
            avatar ? (
              <img
                src={avatar}
                alt={initials}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600">
                {initials}
              </div>
            )
          }

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
              handleDelete(post.id);
              setMenuOpen(false);
            }}
            post={post}
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
                ? "text-slate-400"
                : "text-slate-400 "
            }`}
          >
            {liked ? <Heart size={16}/> : <Heart  size={16}/>} {likeCount}
          </button>

          {/* COMMENTS */}
          <button
             onClick={() => setShowComments((prev) => !prev)}
             className="text-xs text-slate-400 hover:text-slate-600"
          >
                <MessageCircle  size={16}/> {commentsCount}
          </button>

        </div>
        
        {/**Comments */}
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
