import { useEffect, useState } from "react";
import { getProfile, editProfile, uploadAvatar } from "../api/user.api";
import useAuthStore from "../store/authstore";
import PostCard from "../components/PostCard";
import { getPostByUser } from "../api/post.api";
export default function Profile() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  useEffect(() => {
    loadProfile();
    loadPosts();
  }, []);
// load profil 
  async function loadPosts() {
   
    try {
      const data = await getPostByUser(userId);
      setPosts(data || []);
    } catch (error) {
      console.error("Erreur chargement posts :", error);
      setPosts([]);
    }
  
  }
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
    setAvatarFile(null);
    setEditMode(false);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      
      await editProfile({ name, bio }, token);

     
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const updatedUser = await uploadAvatar(formData, token);

        setProfile(updatedUser);
        setUser(updatedUser);
      } else {
        // reload simple profil
        const fresh = await getProfile(token);
        setProfile(fresh);
        setUser(fresh);
      }

      setEditMode(false);
      setAvatarFile(null);

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
                src={
                profile.avatar?.startsWith("http")
                 ? profile.avatar
                : `http://localhost:3000${profile.avatar}`
                  }
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
                onChange={(e) => setAvatarFile(e.target.files[0])}
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

          {user && editMode ? (
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
     {Array.isArray(posts) &&
        posts.map((post) => (
       <PostCard key={post.id} post={post} />
      ))}
 </div>
  );
}