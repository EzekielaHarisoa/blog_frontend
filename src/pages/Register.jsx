import { useState } from "react";
import { register } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      setLoading(true);
      const data = await register({ name, email, password });

      localStorage.setItem("token", data.token);

      alert("Inscription réussie");
      window.location.reload();
    } catch (err) {
      setError("Erreur lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-100">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Créer un compte
        </h1>

        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          Rejoins la plateforme
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-slate-200"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-slate-200"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-slate-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>

        </form>
        <button onClick={()=>navigate("/login")} className="mt-4 text-sm text-blue-500 hover:underline">
            Se connecter
          </button>
      </div>
    </div>
  );
}