import Post from "../models/Post.js";

// ─────────────────────────────────────────
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
// ─────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      tags: tags || [],
    });

    // Populate author info before sending back
    await post.populate("author", "username avatar");

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
// ─────────────────────────────────────────
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })              // newest first
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (only author)
// ─────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if logged in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
// ─────────────────────────────────────────
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      // Unlike — remove user from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Like — add user to likes array
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
// ─────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user.id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    await post.populate("comments.user", "username avatar");

    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};