import { useEffect, useState } from "react";
import useAuthStore from "../store/authstore";
import { editProfile, uploadAvatar } from "../api/user.api";
import { Camera, User, FileText } from "lucide-react";

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
  <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-10">

    <div className="mx-auto max-w-3xl">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your profile and personal information
        </p>
      </div>

      {/* TOP PROFILE PREVIEW (NO CARD) */}
      <div className="flex items-center gap-4 mb-10">

        <div className="relative">
          <img
            src={user?.avatar}
            className="h-20 w-20 rounded-full object-cover border border-white/10"
          />

          <label className="absolute -bottom-1 -right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition">
            <Camera size={14} />
            <input
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-400">Edit your personal identity</p>
        </div>

      </div>

      {/* FORM SECTION (NO CARD STYLE) */}
      <div className="space-y-8">

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <User size={14} /> Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <FileText size={14} /> Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* MESSAGE */}
        {msg && (
          <p
            className={`text-sm ${
              msg.includes("Erreur") ? "text-red-400" : "text-green-400"
            }`}
          >
            {msg}
          </p>
        )}

        {/* BUTTON (FULL WIDTH BUT CLEAN) */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>

      </div>
    </div>
  </div>
);
}