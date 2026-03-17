import User from "../models/User.js";

// ─────────────────────────────────────────
// @route   PUT /api/users/:id/follow
// @desc    Follow or unfollow a user
// @access  Private
// ─────────────────────────────────────────
export const followUser = async (req, res) => {
  try {
    // Can't follow yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = currentUser.following.includes(req.params.id);

    if (alreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      message: alreadyFollowing ? "Unfollowed" : "Followed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};