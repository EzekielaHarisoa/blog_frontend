const API_URL = "http://localhost:3000";

export  function getAvatarUrl(path) {
  if (!path) return null;

  if (path.startsWith("http")) return path;

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}