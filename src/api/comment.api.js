const BASE_URL = "https://api-blog-q81q.onrender.com/api/comments";
//get
export async function getComments(postId) {
  const res = await fetch(
    `${BASE_URL}/posts/${postId}/comments`
  );

  if (!res.ok) {
    throw new Error("Erreur chargement commentaires");
  }

  return await res.json();
}

//creat 
export async function createComment(postId, data, token) {
  const res = await fetch(
    `${BASE_URL}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Erreur création commentaire");
  }

  return await res.json();
}
export async function editComment(id, data, token) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erreur modification commentaire");
  }

  return await res.json();
}
//delete
export async function deleteComment(id, token) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur suppression commentaire");
  }

  return await res.json();
}