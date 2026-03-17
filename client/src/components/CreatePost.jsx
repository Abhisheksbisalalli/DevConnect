import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      const res = await axiosInstance.post("/posts", {
        content,
        tags: tagsArray,
      });

      onPostCreated(res.data.post); // send new post to Feed
      setContent("");
      setTags("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
      <h2 className="text-white font-semibold mb-4">Create Post</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with the dev community..."
          rows={3}
          maxLength={500}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
        />

        {/* Character count */}
        <p className="text-gray-600 text-xs text-right">{content.length}/500</p>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags: React, Node.js, MongoDB  (comma separated)"
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;