import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  deleteComment,
  editComment,
} from "../api/comment.api";
import useAuthStore from "../store/authstore";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // LOAD COMMENTS
  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const res = await getComments(postId);
      const data = res.data || res || [];

      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur chargement commentaires");
      setComments([]);
    }
  }

  // CREATE
  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim() || !token) return;

    try {
      setLoading(true);
      setError("");

      const newComment = await createComment(
        postId,
        { content },
        token
      );

      // optimistic update
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      console.error(err);
      setError("Erreur création commentaire");
    } finally {
      setLoading(false);
    }
  }

  // DELETE 
  async function handleDelete(id) {
    try {
      await deleteComment(id, token);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur suppression commentaire");
    }
  }

  // START EDIT
  function startEdit(comment) {
    setEditingId(comment.id);
    setEditValue(comment.content);
  }

  // SAVE EDIT
  async function saveEdit(id) {
    if (!editValue.trim()) return;

    try {
      //  update
      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, content: editValue } : c
        )
      );

      await editComment(id, { content: editValue }, token);

      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
      setError("Erreur modification commentaire");
      loadComments(); 
    }
  }

  return (
    <div className="mt-4 border-t pt-3">

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {/* FORM */}
      {token && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrire un commentaire..."
            className="flex-1 rounded border p-2 text-sm"
          />

          <button
            disabled={loading}
            className="bg-black text-white px-3 rounded text-sm disabled:opacity-50"
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </form>
      )}

      {/* LIST */}
      <div className="mt-3 space-y-2">
        
        {comments.map((c) => {
          const isOwner =
            token && user &&  Number(user.id) === Number(c.user_id);

          const isEditing = editingId === c.id;

          return (
            <div
              key={c.id}
              className="flex justify-between items-center bg-slate-50 p-2 rounded"
            >
              {/* CONTENT */}
             <div className="flex-1">

             {/* AUTHOR */}
                <div className="flex items-center gap-2 mb-1">

                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold">
                    {c.name?.charAt(0).toUpperCase()}
                  </span>

                 <p className="text-xs font-semibold text-gray-800">
                    {c.name}
                  </p>
                  </div>

              {/* COMMENT CONTENT */}
                  {isEditing ? (
                   <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                   ) : (
                   <p className="text-sm text-gray-700 leading-relaxed ml-8">
                       {c.content}
                   </p>
                   )}

</div>

              {/* ACTIONS */}
              <div className="flex gap-2 text-xs">

                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="text-green-600"
                    >
                      save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500"
                    >
                      cancel
                    </button>
                  </>
                ) : (
                  isOwner && (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="text-blue-500"
                      >
                        edit
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500"
                      >
                        delete
                      </button>
                    </>
                  )
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}