import express from "express";
import { loginUser } from "../controllers/user";

const router = express.Router();

// @route   POST /api/user/
// @desc    Login a user
// @access  Public
router.post("/", loginUser);

export default router;
