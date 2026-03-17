import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:username", getProfile);             // public
router.put("/update", protect, updateProfile);    // private

export default router;