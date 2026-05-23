import { useState, useRef, useEffect } from "react";
import { deletePost, editPost } from "../api/post.api";
import Comments from "./Comments";
import { MessageCircle, Heart, MoreVertical, Pencil, Trash } from "lucide-react";
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
  const [openEdit, setOpenEdit] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const menuRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id ? Number(user.id) : null;

  const isOwner = Number(post.user_id) === currentUserId;

  const imageUrl = post.image?.startsWith("http") ?
                   post.image :post.image ?   
                   `http://localhost:3000${post.image}` : null;

  useEffect(() => {
    setLikeCount(Number(post.likes_count || 0));
    setLiked(post.liked);
  }, [post]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLike() {
    const res = await likePost(post.id);
    setLiked(res.liked);
    setLikeCount(res.likesCount);
  }

  async function handleSaveEdit() {
    try {
      setLoading(true);

      await editPost(post.id, { title, content });

      setOpenEdit(false);
      onEdit?.();

    } catch (err) {
      setError("Erreur modification");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer ce post ?")) return;

    try {
      await deletePost(post.id);
      onDelete?.();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {/* CARD */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white shadow-lg hover:shadow-xl transition">

        {/* HEADER */}
        <div className="flex items-center gap-3">

          <img
            src={post.avatar || getAvatarUrl(post.avatar)}
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="h-10 w-10 cursor-pointer rounded-full object-cover border border-zinc-700"
          /> 
          

          <div>
            <p className="font-semibold text-sm">{post.author}</p>
            <p className="text-xs text-zinc-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* MENU */}
          {isOwner && (
            <div ref={menuRef} className="ml-auto relative">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-zinc-800"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-44 rounded-xl bg-zinc-800 border border-zinc-700 shadow-2xl z-40 overflow-hidden">

                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-zinc-700 text-sm"
                  >
                    <Pencil size={14} /> Modifier
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-500/20 text-red-400 text-sm"
                  >
                    <Trash size={14} /> Supprimer
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* CONTENT */}
        <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
        <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
          {post.content}
        </p>
        {imageUrl && (
         <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800">
           <img
               src={imageUrl}
               alt="post"
               className="max-h-[400px] w-full object-cover hover:scale-[1.02] transition"
           />
         </div>
         )}

        {/* ACTIONS */}
        <div className="mt-4 flex items-center gap-5 border-t border-zinc-800 pt-3">

          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-pink-400"
          >
            <Heart size={16} className={liked ? "text-pink-500" : ""} />
            {likeCount}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-blue-400"
          >
            <MessageCircle size={16} />
            Comments
          </button>

        </div>

        {showComments && (
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <Comments postId={post.id} />
          </div>
        )}

      </div>

      {/* MODAL EDIT  */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl z-[60]">

            <h2 className="text-lg font-bold mb-4">Modifier post</h2>

            {error && (
              <p className="mb-2 text-sm text-red-400">{error}</p>
            )}

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-zinc-800 border border-zinc-700"
              placeholder="Titre"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
              placeholder="Contenu"
            />

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => setOpenEdit(false)}
                className="px-3 py-1 rounded bg-zinc-700"
              >
                Annuler
              </button>

              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-3 py-1 rounded bg-pink-600 hover:bg-pink-500"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}