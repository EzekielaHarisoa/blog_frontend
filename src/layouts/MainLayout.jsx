import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import PostForm from "../components/PostForm";

export default function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">

          {/* LOGO */}
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-lg font-semibold"
          >
            Mon Blog
          </h1>

          {/* SEARCH */}
          <input
            type="search"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-xs rounded-lg border px-3 py-2 outline-none focus:border-black"
          />

          {/* NAV */}
          <nav className="flex items-center gap-4 text-sm">

            <button onClick={() => navigate("/posts")}>
              Articles
            </button>

            

            {token && (
              <button
                onClick={logout}
                className="text-red-500"
              >
                Logout
              </button>
            )}

          </nav>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Outlet context={{ query }} />
      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Mon Blog
      </footer>

     

    </div>
  );
}