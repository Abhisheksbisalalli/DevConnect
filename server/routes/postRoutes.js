import express from "express";
import {
  createPost,
  getAllPosts,
  deletePost,
  likePost,
  addComment,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllPosts);
router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, addComment);

export default router;