import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { loginSuccess } from "../redux/authSlice";
import Navbar from "../components/Navbar";

const EditProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    githubLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const res = await axiosInstance.put("/profile/update", {
        bio: formData.bio,
        skills: skillsArray,
        githubLink: formData.githubLink,
      });

      // Update redux store with new user info
      dispatch(loginSuccess({ user: res.data.user, token }));
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate(`/profile/${user.username}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          <h2 className="text-white text-xl font-bold mb-6">Edit Profile</h2>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Bio */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the community about yourself..."
                rows={3}
                maxLength={200}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
              />
              <p className="text-gray-600 text-xs text-right">
                {formData.bio.length}/200
              </p>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, TypeScript"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <p className="text-gray-600 text-xs mt-1">Separate with commas</p>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                GitHub Link
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;