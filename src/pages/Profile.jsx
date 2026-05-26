import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authstore";

import PostCard from "../components/PostCard";
import FollowCard from "../components/FollowCard";

import { getProfileUser } from "../api/user.api";
import { getPostByUser } from "../api/post.api";
import { getFollowersCount, getFollowingCount } from "../api/follow.api";

export default function Profile() {
  const { id } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const profileId = id ? Number(id) : currentUser?.id; 
  const isMyProfile = !id || Number(id) === Number(currentUser?.id);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (!token) return;
     if (!profileId) return;

     loadAll();
}, [profileId, token]);

  async function loadAll() {
  try {
    setLoading(true);

    const [profileData, postsData, f1, f2] = await Promise.all([
      getProfileUser(profileId, token),
      getPostByUser(profileId, token),
      getFollowersCount(profileId),
      getFollowingCount(profileId),
    ]);

    console.log("PROFILE DATA =", profileData);

    setProfile(profileData);

    setPosts(Array.isArray(postsData) ? postsData : []);

    setFollowers(f1?.followers || 0);
    setFollowing(f2?.following || 0);

  } catch (err) {
    console.error("Profile error:", err);
    setProfile(null);
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <div className="text-center text-slate-400 mt-10">
        Chargement...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-400 mt-10">
        Profil introuvable
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0b0f19] text-white">

    {/* container */}
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* COVER */}
      <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-cyan-500 opacity-80" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* PROFILE CARD */}
      <div className="relative bg-[#121826] border border-white/10 rounded-2xl px-6 pb-6 -mt-10 shadow-xl">

        {/* AVATAR + ACTION */}
        <div className="flex justify-between items-end">

          <img
            src={profile.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border-4 border-[#121826] object-cover shadow-lg"
            alt="avatar"
          />

          {!isMyProfile && (
            <div className="mb-2">
              <FollowCard
                targetUserId={profileId}
                onFollowChange={loadAll}
              />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.name}
          </h1>

          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
            {profile.bio || "Aucune bio"}
          </p>
        </div>

        {/* STATS */}
        <div className="mt-5 flex gap-6 text-sm">

          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <span className="text-white font-bold">{posts.length}</span>
            <span className="text-gray-400 ml-1">Posts</span>
          </div>

          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <span className="text-white font-bold">{followers}</span>
            <span className="text-gray-400 ml-1">Followers</span>
          </div>

          <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <span className="text-white font-bold">{following}</span>
            <span className="text-gray-400 ml-1">Following</span>
          </div>

        </div>
      </div>

      {/* POSTS SECTION */}
      <div className="mt-8">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Posts</h2>
          <div className="text-xs text-gray-400">
            Activité utilisateur
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 border border-white/5 rounded-xl bg-white/5">
              Aucun post
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

    </div>
  </div>
);
}