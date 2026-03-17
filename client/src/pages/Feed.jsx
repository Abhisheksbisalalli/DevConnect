import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all posts on load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Add new post to top of feed
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Remove deleted post from feed
  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Feed */}
        {loading ? (
          <Spinner text="Loading posts..." />
        ) : error ? (
          <div className="text-center text-red-400 py-12">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">Be the first to post something! 🚀</p>
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

export default Feed;