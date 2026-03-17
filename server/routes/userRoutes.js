import express from "express";
import { followUser } from "../controllers/followController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id/follow", protect, followUser);

export default router;