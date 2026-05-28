import { useState, useRef, useEffect } from "react";
import { deletePost, editPost } from "../api/post.api";
import Comments from "./Comments";
import {
  MessageCircle,
  Heart,
  MoreVertical,
  Pencil,
  Trash,
  X,
  Check,
} from "lucide-react";
import { likePost } from "../api/like.api";
import useAuthStore from "../store/authstore";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post, onEdit, onDelete, refresh }) {
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

  const imageUrl = post.image?.startsWith("http")
    ? post.image
    : post.image
    ? `http://localhost:3000${post.image}`
    : null;

  useEffect(() => {
    setLiked(!!post.liked);

    setLikeCount(Number(post.likes_count || 0));
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
    } catch {
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
      <div className="group relative rounded-2xl border border-white/10 bg-[#121826] p-5 text-white shadow-sm hover:shadow-xl transition">

        {/* HEADER */}
        <div className="flex items-center gap-3">

          <img
            src={post.avatar || getAvatarUrl(post.avatar)}
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="h-10 w-10 cursor-pointer rounded-full object-cover border border-white/10 hover:scale-105 transition"
          />

          <div className="flex-1">
            <p className="font-medium text-sm">{post.author}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* MENU */}
          {isOwner && (
            <div ref={menuRef} className="relative">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-44 rounded-xl bg-[#0b0f19] border border-white/10 shadow-xl overflow-hidden">

                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5 text-sm"
                  >
                    <Pencil size={14} /> Modifier
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-500/10 text-red-400 text-sm"
                  >
                    <Trash size={14} /> Supprimer
                  </button>

                </div>
              )}

            </div>
          )}
        </div>

        {/* CONTENT */}
        <h3 className="mt-3 text-lg font-semibold">{post.title}</h3>

        <p className="mt-2 text-sm text-gray-300 line-clamp-3">
          {post.content}
        </p>

        {/* IMAGE */}
        {imageUrl && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
            <img
              src={imageUrl}
              className="max-h-[400px] w-full object-cover hover:scale-[1.02] transition duration-300"
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-3">

          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition"
          >
            <Heart
              size={18}
              className={liked ? "text-pink-500 fill-pink-500" : ""}
            />
            {likeCount}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition"
          >
            <MessageCircle size={18} />
            Comments
          </button>

        </div>

        {/* COMMENTS */}
        {showComments && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <Comments postId={post.id} />
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-[#121826] border border-white/10 p-5">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Modifier post</h2>

              <button
                onClick={() => setOpenEdit(false)}
                className="p-2 hover:bg-white/5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <p className="mb-2 text-sm text-red-400">{error}</p>
            )}

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-2 rounded-lg bg-[#0b0f19] border border-white/10"
              placeholder="Titre"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-2 rounded-lg bg-[#0b0f19] border border-white/10"
              placeholder="Contenu"
            />

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => setOpenEdit(false)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500"
              >
                <Check size={16} />
                Save
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}