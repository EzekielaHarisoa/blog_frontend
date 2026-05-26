import { useEffect, useState } from "react";
import useAuthStore from "../store/authstore";
import {
  followUserApi,
  isFollowingApi,
  unfollowUserApi,
} from "../api/follow.api";

export default function FollowCard({ targetUserId, onFollowChange }) {
  const token = useAuthStore((state) => state.token);

  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  // CHECK FOLLOW STATUS
  useEffect(() => {
    if (!targetUserId || !token) return;
    checkIfFollowing();
  }, [targetUserId, token]);

  async function checkIfFollowing() {
    try {
      const data = await isFollowingApi(targetUserId);
      setFollowed(!!data.following);
    } catch (err) {
      console.error(err);
    }
  }

  // FOLLOW
  async function handleFollow() {
    if (loading) return;

    try {
      setLoading(true);

      await followUserApi(targetUserId);

      setFollowed(true);

      // refresh parent 
      onFollowChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // UNFOLLOW
  async function handleUnfollow() {
    if (loading) return;

    try {
      setLoading(true);

      await unfollowUserApi(targetUserId);

      setFollowed(false);

      onFollowChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

return (
  <button
    onClick={followed ? handleUnfollow : handleFollow}
    disabled={loading}
    className={`
      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
      border border-white/10 shadow-sm
      ${
        followed
          ? "bg-white/5 text-white hover:bg-white/10"
          : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
      }
      disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
    `}
  >
    {loading
      ? "..."
      : followed
      ? "Following"
      : "Follow"}
  </button>
);
}