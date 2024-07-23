import express from "express";

// Controllers
import {
  addCategory,
  getCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

// Get categories
router.get("/", getCategories);

// Add category
router.post("/", addCategory);

export default router;
