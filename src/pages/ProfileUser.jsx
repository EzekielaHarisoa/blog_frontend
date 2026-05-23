import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostByUser } from "../api/post.api";
import useAuthStore from "../store/authstore";
import { getProfileUser } from "../api/user.api";
import PostCard from "../components/PostCard";
import FollowCard from "../components/FollowCard";
import { getFollowersCount,getFollowingCount } from "../api/follow.api";
export default function ProfileUser() {
  const { id } = useParams();
console.log("URL PARAM ID =", id);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!id) return;

    loadUser();
    loadPosts();
    loadCounts();
  }, [id]);

  async function loadCounts () {
    try {
      const f1 = await getFollowersCount(id);
      const f2 = await getFollowingCount(id);

      setFollowers(f1.followers);
      setFollowing(f2.following)
    } catch (error) {
      console.log(error)  
    }
  } 


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

          <FollowCard  
                 targetUserId={id}
                 onFollowChange={loadCounts}
          />
          <div className="flex gap-4 mt-2 text-sm">
             <p><b>{followers}</b> Followers</p>
             <p><b>{following}</b> Following</p>
          </div>
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