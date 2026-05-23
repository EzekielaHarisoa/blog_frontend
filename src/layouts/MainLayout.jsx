import { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import useAuthStore from "../store/authstore";
import { PersonStanding } from "lucide-react";
import { Home } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f19]/90 backdrop-blur">

        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">

          {/* LOGO */}
          <h1
            onClick={() => navigate("/posts")}
            className="cursor-pointer text-xl font-bold"
          >
            OtakuVerse
          </h1>

          {/* SEARCH */}
          <input
            type="search"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="hidden md:block w-64 rounded-lg bg-zinc-900 px-3 py-2 text-sm outline-none border border-white/10 focus:border-violet-500"
          />

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* LINKS */}
            <Link to="/posts" className="text-sm text-zinc-300 hover:text-white">
              <Home size={16}/>
            </Link>

            <Link to="/profile" className="text-sm text-zinc-300 hover:text-white">
              <PersonStanding/>
            </Link>

            {/* AVATAR BUTTON */}
            {user && (
              <button
                onClick={() => setOpen(true)}
                className="rounded-full hover:ring-2 hover:ring-violet-500 transition"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-violet-600 flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            )}

          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet context={{ query }} />
      </main>

    
      {open && (
        <div className="fixed inset-0 z-50">

          {/* OVERLAY */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* PANEL */}
          <div className="absolute right-0 top-0 h-full w-72 bg-[#0f1424] border-l border-white/10 p-5">

            {/* USER INFO */}
            <div className="flex items-center gap-3 mb-6">

              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-zinc-400">Otaku Member</p>
              </div>

            </div>

            {/* MENU */}
            <div className="flex flex-col gap-2">

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-white/5"
              >
                👤 Profile
              </button>

              <button
                className="text-left px-3 py-2 rounded-lg hover:bg-white/5"
                onClick={()=>{
                  navigate("/settings/profile")
                  setOpen(false)

                }}
              >
                ⚙️ Settings
              </button>

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                🚪 Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}