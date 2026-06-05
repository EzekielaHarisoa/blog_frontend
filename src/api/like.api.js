const BASE_URL = "https://api-blog-q81q.onrender.com/api/likes/posts";

export const likePost = async (postId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erreur like post");
  }

  return await res.json();
};