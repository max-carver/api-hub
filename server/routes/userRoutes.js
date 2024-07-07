import express from "express";
import {
	getUserProfile,
	loginUser,
	logoutUser,
	registerUser,
	updateUserProfile,
} from "../controllers/userControllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
	.route("/profile")
	.get(protectRoute, getUserProfile)
	.put(protectRoute, updateUserProfile);

export default router;
