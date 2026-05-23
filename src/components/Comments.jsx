import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  deleteComment,
  editComment,
} from "../api/comment.api";
import useAuthStore from "../store/authstore";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { Send, Pencil, Trash } from "lucide-react";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const res = await getComments(postId);
      setComments(res.data || res || []);
    } catch (err) {
      setError("Erreur chargement commentaires");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);

      const newComment = await createComment(postId, { content }, token);

      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch {
      setError("Erreur création commentaire");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await deleteComment(id, token);
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditValue(c.content);
  }

  async function saveEdit(id) {
    if (!editValue.trim()) return;

    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content: editValue } : c
      )
    );

    await editComment(id, { content: editValue }, token);

    setEditingId(null);
    setEditValue("");
  }

  return (
    <div className="mt-4 border-t border-zinc-800 pt-4">

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-sm mb-2">{error}</p>
      )}

      {/* INPUT */}
      {token && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 mb-4"
        >
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrire un commentaire..."
            className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-pink-500"
          />

          <button
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-500 transition px-3 py-2 rounded-lg text-white"
          >
            <Send size={16} />
          </button>
        </form>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {comments.map((c) => {
          const isOwner =
            user && Number(user.id) === Number(c.user_id);

          const isEditing = editingId === c.id;
          const avatar = getAvatarUrl(c.avatar);
          const initial = c.name?.[0]?.toUpperCase() || "?";

          return (
            <div
              key={c.id}
              className="flex gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
            >

              {/* AVATAR */}
              {avatar ? (
                <img
                  src={avatar}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
              )}

              {/* CONTENT */}
              <div className="flex-1">

                <p className="text-xs text-zinc-400 font-semibold">
                  {c.name}
                </p>

                {isEditing ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
                  />
                ) : (
                  <p className="text-sm text-zinc-200 mt-1">
                    {c.content}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              {isOwner && (
                <div className="flex flex-col gap-2 text-xs">

                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(c.id)}
                        className="text-green-400"
                      >
                        save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="text-zinc-400"
                      >
                        cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash size={14} />
                      </button>
                    </>
                  )}

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}