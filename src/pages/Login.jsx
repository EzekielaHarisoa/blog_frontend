import { useState } from "react";
import { login } from "../api/auth.api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email et mot de passe requis");
            return;
        }

        try {
            setLoading(true);

            const data = await login({ email, password });

            localStorage.setItem("token", data.token);

            alert("Login successful");

        } catch (error) {
            console.log(error);
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="form-login">
            <h1>Login</h1>

            {/* ERROR */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-3">

                <input
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </button>

            </div>
        </form>
    );
}