import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/user.api";
import PostCard from "../components/PostCard";
import FollowCard from "../components/FollowCard";

export default function UserProfile() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadUser();
    loadPosts();
  }, [id]);

  async function loadUser() {
    const data = await getUserById(id);
    setProfile(data);
  }

  async function loadPosts() {
    const data = await getPostByUser(id);
    setPosts(data || []);
  }

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">

      {/* PROFILE HEADER */}
      <div className="border p-4 rounded">
       <div className="flex items-center flex-row ">
         <div className="flex items-center gap-4">
            <img
             src={profile.avatar} alt={profile.name}
             className="w-20 h-20 rounded-full object-cover "
             />
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>
        </div>
       
        <FollowCard targetUserId={id} />
       </div>

      </div>

      {/* POSTS */}
      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

    </div>
  );
}