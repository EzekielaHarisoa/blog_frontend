import { useState } from "react";
import { register, loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authstore";
import { AlertCircle, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (password.length < 6) {
      setError("Mot de passe trop court");
      return;
    }

    try {
      setLoading(true);

      await register({ name, email, password });

      const data = await loginApi({ email, password });
      login(data);

      navigate("/posts");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erreur lors de l'inscription";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 text-white">

      {/* IMAGE BACKGROUND */}
      <img
        src="/hero1.webp"
        className="
          absolute inset-0
          h-full w-full
          object-cover
          blur-[2px]
          scale-110
        "
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* GLOW */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-md">

        {/* BRAND */}
        <div className="mb-10 text-center">
          <h1 className="
            text-4xl font-black
            bg-gradient-to-r from-violet-400 to-cyan-400
            bg-clip-text text-transparent
          ">
            OtakuVerse
          </h1>

          <p className="text-sm text-zinc-300 mt-2">
            Create your account and join the universe
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          p-8
          shadow-2xl
          shadow-black/40
        ">

          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-6">

            {/* NAME */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 flex items-center gap-2">
                <User size={14} /> Name
              </label>

              <input
                type="text"
                placeholder="Naruto Uzumaki"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 flex items-center gap-2">
                <Mail size={14} /> Email
              </label>

              <input
                type="email"
                placeholder="anime@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 flex items-center gap-2">
                <Lock size={14} /> Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition py-2 font-semibold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-10 text-center text-sm text-zinc-400">
            <p>Already have an account?</p>

            <button
              onClick={() => navigate("/login")}
              className="mt-2 text-violet-400 hover:text-violet-300 font-medium"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}