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
  <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center px-4 relative overflow-hidden">

    {/* BACKGROUND GLOW */}
    <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

    {/* MAIN WRAPPER */}
    <div className="w-full max-w-md">

      {/* BRAND */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          OtakuVerse
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Welcome back, continue your journey
        </p>
      </div>

      {/* ERROR (INLINE STYLE) */}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-6">

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-xs tracking-wide text-zinc-400 flex items-center gap-2">
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
          <label className="text-xs tracking-wide text-zinc-400 flex items-center gap-2">
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
          {loading ? "Connecting..." : "Sign in"}
        </button>

      </form>

      {/* FOOTER */}
      <div className="mt-10 text-center text-sm text-zinc-400">
        <p>
          No account yet?
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-2 text-violet-400 hover:text-violet-300 font-medium"
        >
          Create account
        </button>
      </div>

    </div>
  </div>
);
}