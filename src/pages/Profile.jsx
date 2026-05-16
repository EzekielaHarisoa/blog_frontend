import { useEffect, useState } from "react";
import { getProfile, editProfile, uploadAvatar } from "../api/user.api";
import useAuthStore from "../store/authstore";

export default function Profile() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile(token);

      setProfile(data);
      setName(data.name || "");
      setBio(data.bio || "");

    } catch (err) {
      console.error(err);
      setError("Erreur chargement profil");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setName(profile?.name || "");
    setBio(profile?.bio || "");
    setEditMode(false);
  }

  async function handleAvatarUpload(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    await uploadAvatar(formData, token);
    const fresh = await getProfile(token);

    setProfile(fresh);
    setUser(fresh);

  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      await editProfile({ name, bio }, token);

      const fresh = await getProfile(token);

      setProfile(fresh);
      setUser(fresh);
     
      if (!fresh.avatar && profile?.avatar) {
         fresh.avatar = profile.avatar;
       }

      setEditMode(false);

    } catch (err) {
      console.error(err);
      setError("Erreur sauvegarde profil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500">
        Chargement...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="relative w-20 h-20">
            
            {profile?.avatar ? (
              <img
                src={`http://localhost:3000/api${profile.avatar}`}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                     const file = e.target.files[0];
                      if (file) handleAvatarUpload(file);
                 }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>

          {/* INFOS */}
          <div className="flex-1">

            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2 text-sm w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">
                {profile.name}
              </h1>
            )}

            <p className="text-sm text-gray-500">
              {profile.email}
            </p>

          </div>

        </div>

        {/* BIO */}
        <div className="mt-6">

          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Bio
          </h2>

          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border rounded p-2 text-sm w-full"
            />
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {profile.bio || "Aucune bio"}
            </p>
          )}

        </div>

        {/* DATE */}
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-400">
            Compte créé le{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-2">

          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>

              <button
                onClick={handleCancel}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
            >
              Modifier Profil
            </button>
          )}

        </div>

      </div>
    </div>
  );
}