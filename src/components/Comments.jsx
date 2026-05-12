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

  // LOAD
  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    const data = await getComments(postId);
    setComments(data);
  }

  // CREATE
  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
        setError("Le contenu est requis.");
        return;
    }

    const newComment = await createComment(
      postId,
      { content },
      token
    );

    setComments([...comments, newComment]);
    setContent("");
    setError("");
  }

  // DELETE 
  async function handleDelete(id) {
    setComments(comments.filter(c => c.id !== id));
    await deleteComment(id, token);
  }

  // EDIT debut
  function startEdit(comment) {
    setEditingId(comment.id);
    setEditValue(comment.content);
  }

  // EDIT save
  async function saveEdit(id) {
    const updated = await editComment(
      id,
      { content: editValue },
      token
    );

    setComments(
      comments.map(c =>
        c.id === id ? updated : c
      )
    );

    setEditingId(null);
    setEditValue("");
  }

  return (
    <div className="mt-4 border-t pt-3">

      {/* FORM ADD */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="flex-1 rounded-lg border p-2 text-sm"
        />

        <button className="rounded bg-black px-3 text-white text-sm">
          Envoyer
        </button>
      </form>

      {/* LIST */}
      <div className="mt-3 space-y-2">

        {comments.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 p-2"
          >

            {/* LEFT SIDE */}
            <div className="flex-1">

              {/* EDIT MODE */}
              {editingId === c.id ? (
                <input
                  value={editValue}
                  onChange={(e) =>
                    setEditValue(e.target.value)
                  }
                  className="w-full rounded border p-1 text-sm"
                />
              ) : (
                <p className="text-sm">{c.content}</p>
              )}
            </div>

            {/* ACTIONS */}
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