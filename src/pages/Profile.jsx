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
  <div className="min-h-screen text-white relative overflow-hidden">

    {/* BACKGROUND GLOW (cohérent app) */}
    <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">

      {/* COVER */}
      <div className="relative h-48 rounded-3xl overflow-hidden border border-white/10 shadow-xl">

        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-cyan-500 opacity-80" />
        <div className="absolute inset-0 bg-black/30" />

        {/* glow overlay */}
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* PROFILE CARD */}
      <div className="
        relative -mt-12
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
        shadow-black/40
        px-6 pb-6 pt-6
      ">

        {/* AVATAR + ACTION */}
        <div className="flex justify-between items-end">

          <img
            src={profile.avatar || "/default-avatar.png"}
            className="
              w-28 h-28
              rounded-full
              border-4 border-[#0b0f19]
              object-cover
              shadow-lg
            "
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
        <div className="mt-4">
          <h1 className="text-2xl font-black tracking-tight">
            {profile.name}
          </h1>

          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            {profile.bio || "Aucune bio"}
          </p>
        </div>

        {/* STATS */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">

          <div className="
            px-4 py-2
            rounded-xl
            bg-white/5
            border border-white/10
            backdrop-blur-md
            hover:bg-white/10
            transition
          ">
            <span className="text-white font-bold">{posts.length}</span>
            <span className="text-zinc-400 ml-1">Posts</span>
          </div>

          <div className="
            px-4 py-2
            rounded-xl
            bg-white/5
            border border-white/10
            backdrop-blur-md
            hover:bg-white/10
            transition
          ">
            <span className="text-white font-bold">{followers}</span>
            <span className="text-zinc-400 ml-1">Followers</span>
          </div>

          <div className="
            px-4 py-2
            rounded-xl
            bg-white/5
            border border-white/10
            backdrop-blur-md
            hover:bg-white/10
            transition
          ">
            <span className="text-white font-bold">{following}</span>
            <span className="text-zinc-400 ml-1">Following</span>
          </div>

        </div>
      </div>

      {/* POSTS */}
      <div className="mt-10">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Posts</h2>
          <div className="text-xs text-zinc-400">
            Activité utilisateur
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="
              text-center text-zinc-400
              py-10
              border border-white/10
              rounded-2xl
              bg-white/5
              backdrop-blur-md
            ">
              Aucun post
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-md
                  shadow-md
                  hover:shadow-violet-500/10
                  transition
                "
              >
                <PostCard post={post} refresh={loadAll}/>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>
);
}