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

  const profileId = id || currentUser?.id;
  const isMyProfile = !id || Number(id) === Number(currentUser?.id);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    loadAll();
  }, [profileId]);

  async function loadAll() {
    try {
      setLoading(true);

      const [p, postsData, f1, f2] = await Promise.all([
        getProfileUser(profileId, token),
        getPostByUser(profileId),
        getFollowersCount(profileId),
        getFollowingCount(profileId),
      ]);

      setProfile(p);
      setPosts(postsData || []);
      setFollowers(f1.followers || 0);
      setFollowing(f2.following || 0);
    } catch (err) {
      console.error(err);
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
    <div className="max-w-3xl mx-auto text-slate-100">

      {/* COVER */}
      <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-t-2xl" />

      {/* HEADER */}
      <div className="bg-slate-900 rounded-b-2xl px-6 pb-6 border border-slate-800">

        {/* AVATAR + ACTION */}
        <div className="flex justify-between items-end -mt-10">

          <img
            src={profile.avatar}
            className="w-20 h-20 rounded-full border-4 border-slate-900 object-cover"
          />

          {!isMyProfile && (
            <FollowCard
              targetUserId={profileId}
              onFollowChange={loadAll}
            />
          )}
        </div>

        {/* INFO */}
        <div className="mt-3">
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-sm text-slate-400">
            {profile.bio || "Aucune bio"}
          </p>
        </div>

        {/* STATS */}
        <div className="flex gap-6 mt-4 text-sm text-slate-400">

          <div>
            <span className="text-white font-bold">{posts.length}</span> Posts
          </div>

          <div>
            <span className="text-white font-bold">{followers}</span> Followers
          </div>

          <div>
            <span className="text-white font-bold">{following}</span> Following
          </div>

        </div>
      </div>

      {/* POSTS */}
      <div className="mt-6 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-slate-500">
            Aucun post
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}