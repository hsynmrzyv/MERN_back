import express from "express";

// Controllers
import { addColor, getColors } from "../controllers/color.controller.js";

const router = express.Router();

// GET all colors
router.get("/", getColors);

// POST single color
router.post("/", addColor);

export default router;
