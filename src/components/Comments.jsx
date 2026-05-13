import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  deleteComment,
  editComment,
} from "../api/comment.api";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // LOAD COMMENTS
  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const res = await getComments(postId);

      // IMPORTANT : adapte selon backend
      const data = res.data || res || [];

      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur chargement commentaires");
      setComments([]);
    }
  }

  // CREATE COMMENT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const newComment = await createComment(
        postId,
        { content },
        token
      );

      // reload propre (évite bugs backend response)
      await loadComments();

      setContent("");
    } catch (err) {
      console.error(err);
      setError("Erreur création commentaire");
    }
  }

  // DELETE
  async function handleDelete(id) {
    try {
      await deleteComment(id, token);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // EDIT
  function startEdit(comment) {
    setEditingId(comment.id);
    setEditValue(comment.content);
  }

  async function saveEdit(id) {
    try {
      const updated = await editComment(
        id,
        { content: editValue },
        token
      );

      await loadComments();
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-4 border-t pt-3">

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="flex-1 rounded border p-2 text-sm"
        />
        <button className="bg-black text-white px-3 rounded text-sm">
          Envoyer
        </button>
      </form>

      {/* LIST */}
      <div className="mt-3 space-y-2">
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-slate-50 p-2 rounded"
          >
            <div className="flex-1">
              {editingId === c.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full border p-1 text-sm"
                />
              ) : (
                <p className="text-sm">{c.content}</p>
              )}
            </div>

            <div className="flex gap-2 text-xs">
              {editingId === c.id ? (
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}