import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { username } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // ── Fetch Profile ──
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/profile/${username}`);
        setProfile(res.data);
        // Check if logged in user already follows this profile
        setFollowing(
          res.data.followers.some((f) => f._id === user?.id)
        );

        // Fetch all posts and filter by this user
        const postsRes = await axiosInstance.get("/posts");
        const userPosts = postsRes.data.filter(
          (p) => p.author?.username === username
        );
        setPosts(userPosts);
      } catch (err) {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // ── Follow / Unfollow ──
  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await axiosInstance.put(`/users/${profile._id}/follow`);
      setFollowing(!following);
      setProfile((prev) => ({
        ...prev,
        followers: following
          ? prev.followers.filter((f) => f._id !== user?.id)
          : [...prev.followers, { _id: user?.id, username: user?.username }],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Handle Post Deleted ──
  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Spinner text="Loading profile..." />
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="text-center text-red-400 py-20">{error}</div>
      </div>
    );
  }

  const isOwnProfile = user?.username === username;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">

          {/* Top Row */}
          <div className="flex items-start justify-between mb-4">

            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">
                  {profile.username}
                </h2>
                <p className="text-gray-500 text-sm">{profile.email}</p>
              </div>
            </div>

            {/* Follow / Edit Button */}
            {isOwnProfile ? (
              <a
                href="/edit-profile"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition"
              >
                ✏️ Edit Profile
              </a>
            ) : (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`text-sm px-5 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${
                  following
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {followLoading ? "..." : following ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
          )}

          {/* GitHub Link */}
          {profile.githubLink && (
            <a
              href={profile.githubLink}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 text-sm hover:underline mb-4 inline-block"
            >
              🔗 GitHub Profile
            </a>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 border-t border-gray-800 pt-4 mt-2">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{posts.length}</p>
              <p className="text-gray-500 text-xs">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {profile.followers?.length}
              </p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {profile.following?.length}
              </p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <h3 className="text-white font-semibold text-lg mb-4">
          {isOwnProfile ? "Your Posts" : `${profile.username}'s Posts`}
        </h3>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No posts yet</p>
            {isOwnProfile && (
              <p className="text-sm mt-1">Share your first post on the feed! 🚀</p>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;