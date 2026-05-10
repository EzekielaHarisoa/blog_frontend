import { useState } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const data = await login({ email, password });

      localStorage.setItem("token", data.token);

      navigate("/posts");
      window.location.reload();
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-1 text-2xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-gray-500">
          Connecte-toi pour continuer
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>
        <button onClick={()=>navigate("/register")} className="mt-4 text-sm text-blue-500 hover:underline">
          S'incrire
        </button>
      </div>
    </div>
  );
}