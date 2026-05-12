export async function getComments(postId) {
  const res = await fetch(`/posts/${postId}/comments`);
  return res.json();
}

export async function createComment(postId, data, token) {
  const res = await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function editComment(id, data, token) {
  const res = await fetch(`/comments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteComment(id, token) {
  await fetch(`/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}