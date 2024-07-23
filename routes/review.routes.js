import express from "express";

// Protect Route
import { protectRoute } from "../middlewares/protectRoute.js";

// Controllers
import {
  addReview,
  getReviews,
  getSpecificReviews,
} from "../controllers/reviews.controller.js";

const router = express.Router();

// GET all reviews
router.get("/", getReviews);

// GET single review
router.get("/:productId", getSpecificReviews);

// POST single review
router.post("/", protectRoute, addReview);

export default router;
