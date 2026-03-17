import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const PostCard = ({ post, onDelete }) => {
  const { user } = useSelector((state) => state.auth);
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(user?.id));
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // ── Like / Unlike ──
  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Add Comment ──
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await axiosInstance.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  // ── Delete Post ──
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Format Date ──
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <Link
              to={`/profile/${post.author?.username}`}
              className="text-white font-semibold text-sm hover:text-indigo-400 transition"
            >
              {post.author?.username}
            </Link>
            <p className="text-gray-500 text-xs">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Delete button (only for post author) */}
        {user?.id === post.author?._id && (
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-400 text-xs transition"
          >
            🗑 Delete
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-200 text-sm leading-relaxed mb-3">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 border-t border-gray-800 pt-3">

        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition ${
            liked ? "text-indigo-400" : "text-gray-500 hover:text-indigo-400"
          }`}
        >
          {liked ? "💙" : "🤍"} {likes} {likes === 1 ? "Like" : "Likes"}
        </button>

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-400 transition"
        >
          💬 {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 space-y-3">

          {/* Existing comments */}
          {comments.map((comment, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-2 flex-1">
                <p className="text-indigo-400 text-xs font-semibold mb-1">
                  {comment.user?.username}
                </p>
                <p className="text-gray-300 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {commentLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;