import express from "express";

// Controllers
import {
  signin,
  signup,
  logout,
  resetPassword,
  forgetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Sign In
router.post("/signin", signin);

// Sign Up
router.post("/signup", signup);

// Logout
router.post("/logout", logout);

// Reset
router.post("/reset-password", resetPassword);

// Forget
router.post("/forget-password", forgetPassword);

export default router;
