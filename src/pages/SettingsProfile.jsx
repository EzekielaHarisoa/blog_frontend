import { useEffect, useState } from "react";
import useAuthStore from "../store/authstore";
import { editProfile, uploadAvatar } from "../api/user.api";

export default function SettingsProfile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setBio(user.bio || "");
  }, [user]);

  async function handleSave() {
    try {
      setLoading(true);
      setMsg("");

      await editProfile({ name, bio }, token);

      if (avatar) {
        const form = new FormData();
        form.append("avatar", avatar);

        const updated = await uploadAvatar(form, token);
        setUser(updated);
      }

      setMsg("Profil mis à jour");
    } catch (err) {
      setMsg("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex justify-center px-4 py-10">

      <div className="w-full max-w-xl">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* CARD */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">

          {/* AVATAR SECTION */}
          <div className="flex items-center gap-4">

            <img
              src={user?.avatar}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-violet-500/40"
            />

            <label className="text-sm text-violet-300 cursor-pointer hover:text-violet-200">
              Change avatar
              <input
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>

          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-zinc-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2 outline-none focus:border-violet-500"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-sm text-zinc-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2 outline-none focus:border-violet-500"
            />
          </div>

          {/* MESSAGE */}
          {msg && (
            <p className="text-sm text-green-400">{msg}</p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-2 font-semibold hover:opacity-90 transition"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>
    </div>
  );
}