import express from "express";

// Controllers
import { addSize, getSizes } from "../controllers/size.controller.js";

const router = express.Router();

// GET all sizes
router.get("/", getSizes);

// POST single size
router.post("/", addSize);

export default router;
