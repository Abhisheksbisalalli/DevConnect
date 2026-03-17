import User from "../models/User.js";

// ─────────────────────────────────────────
// @route   GET /api/profile/:username
// @desc    Get any user's profile
// @access  Public
// ─────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")               // never send password
      .populate("followers", "username avatar")   // show follower details
      .populate("following", "username avatar");  // show following details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/profile/update
// @desc    Update logged in user's profile
// @access  Private
// ─────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { bio, skills, githubLink, avatar } = req.body;

    // Build update object with only provided fields
    const updatedFields = {};
    if (bio !== undefined) updatedFields.bio = bio;
    if (skills !== undefined) updatedFields.skills = skills;
    if (githubLink !== undefined) updatedFields.githubLink = githubLink;
    if (avatar !== undefined) updatedFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,           // from JWT middleware
      { $set: updatedFields },
      { new: true }          // return updated document
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};