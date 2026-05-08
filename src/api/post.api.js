const BASE_URL = "http://localhost:3000/api/posts";

export async function getPosts(page = 1, limit = 5) {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}