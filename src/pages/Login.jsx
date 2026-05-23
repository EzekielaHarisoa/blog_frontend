import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authstore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((state)=>state.login);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email et mot de passe requis");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginApi({ email, password });
      login(data);
      navigate("/posts");

    } catch (err) {
         setError("Email ou mot de passe incorrect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] px-4">

    {/* Background glow */}
    <div className="absolute h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"></div>
    <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

      {/* TOP */}
      <div className="mb-8 text-center">

        <h1 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-4xl font-extrabold text-transparent">
          OtakuVerse
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Connecte-toi à ton univers
        </p>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Email
          </label>

          <input
            type="email"
            placeholder="anime@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-3 text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Mot de passe
          </label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 p-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

      </form>

      {/* FOOTER */}
      <div className="mt-6 text-center">

        <p className="text-sm text-zinc-400">
          Pas encore de compte ?
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          Créer un compte
        </button>

      </div>
    </div>
  </div>
);
}