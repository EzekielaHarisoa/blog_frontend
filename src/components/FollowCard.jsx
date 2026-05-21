import { useState } from "react";
import useAuthStore from "../store/authstore";
import { followUserApi, unfollowUserApi } from "../api/follow.api";

export default function FollowCard({ targetUserId, isFollowing = false }) {
  const token = useAuthStore((state) => state.token);

  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(isFollowing);

  async function handleFollow() {
    try {
      setLoading(true);

      await followUserApi(targetUserId);
      setFollowed(true);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnfollow() {
    try {
      setLoading(true);

      await unfollowUserApi(targetUserId);
      setFollowed(false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 p-4 border rounded">
      {followed ? (
        <button
          disabled={loading}
          onClick={handleUnfollow}
          className="px-3 py-1 border rounded"
        >
          Unfollow
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={handleFollow}
          className="px-3 py-1 bg-black text-white rounded"
        >
          Follow
        </button>
      )}
    </div>
  );
}