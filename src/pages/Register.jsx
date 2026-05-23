import { useState } from "react";
import { register ,loginApi} from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  //register 
  async function handleRegister(e) {
  e.preventDefault();
  setError("");

  if (!name || !email || !password) {
    setError("Tous les champs sont obligatoires");
    return;
  }

  try {
    setLoading(true);

    await register({ name, email, password });

    const loginRes = await loginApi({ email, password });

    localStorage.setItem("token", loginRes.token);

    alert("Inscription réussie");

    window.location.reload();

  } catch (err) {
    setError(err.message || "Erreur lors de l'inscription");
    console.error(err);
  } finally {
    setLoading(false);
  }
}

 return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f19] px-4">

    {/* BACKGROUND GLOW */}
    <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"></div>
    <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

      {/* HEADER */}
      <div className="mb-8 text-center">

        <h1 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-4xl font-extrabold text-transparent">
          Join OtakuVerse
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Crée ton univers otaku
        </p>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleRegister} className="space-y-5">

        {/* NAME */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Nom
          </label>

          <input
            type="text"
            placeholder="Naruto Uzumaki"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-3 text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
        </div>

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
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
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
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-3 text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 p-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Créer un compte"}
        </button>

      </form>

      {/* FOOTER */}
      <div className="mt-6 text-center">

        <p className="text-sm text-zinc-400">
          Déjà membre ?
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          Se connecter
        </button>

      </div>

    </div>
  </div>
);
}