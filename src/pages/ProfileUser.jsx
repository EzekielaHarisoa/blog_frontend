import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostByUser } from "../api/post.api";
import useAuthStore from "../store/authstore";
import { getProfileUser } from "../api/user.api";
import PostCard from "../components/PostCard";
import FollowCard from "../components/FollowCard";
export default function ProfileUser() {
  const { id } = useParams();
console.log("URL PARAM ID =", id);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!id) return;

    loadUser();
    loadPosts();
  }, [id]);

  async function loadUser() {
    const data = await getProfileUser(id, token);
    setProfile(data);
  }

  async function loadPosts() {
    const data = await getPostByUser(id);
    setPosts(data || []);
     console.log("POSTS RESPONSE =", data);
  }

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">

      <div className="border p-4 rounded">
        <div className="flex items-center gap-4">
          
          <img
            src={profile.avatar}
            className="w-20 h-20 rounded-full object-cover"
          />

          <div>
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>
          </div>

          <FollowCard targetUserId={id} />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

    </div>
  );
}