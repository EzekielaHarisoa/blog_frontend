import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import useAuthStore from "../store/authstore";
import {
  Home,
  User,
  Settings,
  LogOut,
  Search,
  Filter,
  Menu,
  X,
} from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [title, setTitle] = useState("all");

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    setOpen(false);
    setMobileMenu(false);
    navigate("/login", { replace: true });
  }
 const images = [
  "/hero1.webp",
  "/hero2.webp",
  "/hero3.webp",
];

const [index, setIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);
  return (
  <div className="relative min-h-screen text-white overflow-hidden">   
     
       {/* BACKGROUND SLIDESHOW */}
      <div className="fixed inset-0 -z-10">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-10000
              ${i === index ? "opacity-30" : "opacity-10"}
            `}
          />
        ))}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#0b0f19]/90" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f19]/90 backdrop-blur">

        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">

          {/* LOGO + MOBILE MENU */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>

            <h1
               onClick={() => navigate("/posts")}
               className="
                        cursor-pointer
                        text-2xl
                        font-black
                        tracking-wide
                        bg-gradient-to-r
                      from-violet-400
                      to-pink-500
                        bg-clip-text
                        text-transparent
                       "
              >
                 OTAKUVERSE
            </h1>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex items-center gap-2">

            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className=" w-64 rounded-xl bg-white/5 backdrop-blur-md pl-9 pr-3 py-2 text-sm border border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 outline-none transition-all"              />
            </div>

            <div className="relative">
              <Filter size={16} className="absolute left-3 top-2.5 text-zinc-400" />
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg bg-zinc-900 pl-9 pr-3 py-2 text-sm border border-white/10"
              >
                <option value="all">Tous</option>
                <option value="anime">Anime</option>
                <option value="manga">Manga</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>

          </div>

          {/* PROFILE BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="rounded-full hover:ring-2 hover:ring-violet-500"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="h-9 w-9 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-violet-600 flex items-center justify-center font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-2xl px-4 py-6 pb-20 md:pb-6">
        <Outlet context={{ query, title }} />
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f1424] border-t border-white/10 flex justify-around py-2 z-40">

        <Link
          to="/posts"
          onClick={() => setMobileMenu(false)}
          className="flex flex-col items-center text-xs text-zinc-400 hover:text-white"
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          to={`/profile/${user?.id}`}
          onClick={() => setMobileMenu(false)}
          className="flex flex-col items-center text-xs text-zinc-400 hover:text-white"
        >
          <User size={18} />
          Profile
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-xs text-zinc-400 hover:text-white"
        >
          <Settings size={18} />
          Menu
        </button>

      </div>

      {/* ================= PROFILE PANEL ================= */}
      {open && (
        <div className="fixed inset-0 z-50">

          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-full w-72 bg-[#0f1424] border-l border-white/10 p-5">

            <div className="flex items-center gap-3 mb-6">

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}

              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-zinc-400">Otaku Member</p>
              </div>

            </div>

            <div className="flex flex-col gap-2">

              <button
                onClick={() => {
                  navigate(`/profile/${user?.id}`);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={() => {
                  navigate("/settings/profile");
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} /> Logout
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= MOBILE FULL MENU ================= */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">

          <div
            onClick={() => setMobileMenu(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-[#0f1424] border-r border-white/10 p-5">

            <div className="flex justify-between items-center mb-6">
              <p className="font-bold">Menu</p>
              <button onClick={() => setMobileMenu(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2">

              <Link
                to="/posts"
                onClick={() => setMobileMenu(false)}
                className="px-3 py-2 hover:bg-white/5 rounded-lg"
              >
                Home
              </Link>

              <Link
                to={`/profile/${user?.id}`}
                onClick={() => setMobileMenu(false)}
                className="px-3 py-2 hover:bg-white/5 rounded-lg"
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenu(false);
                }}
                className="text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}