import { useState } from "react";
import { register, loginApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      window.location.reload();
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 relative overflow-hidden">

      {/* subtle background */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -bottom-40 -right-40" />

      {/* CARD */}
      <div className="w-full max-w-md bg-[#121826] border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Créer un compte
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Rejoins la plateforme
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0b0f19] border border-white/10 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0b0f19] border border-white/10 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0b0f19] border border-white/10 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer un compte"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Déjà un compte ?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-400 hover:underline"
          >
            Se connecter
          </button>
        </div>

      </div>
    </div>
  );
}