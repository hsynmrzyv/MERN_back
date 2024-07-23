import express from "express";

// Protect Route
import { protectRoute } from "../middlewares/protectRoute.js";

// Controllers
import {
  addOrder,
  getOrders,
  getSingleOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.use(protectRoute);

// GET all orders
router.get("/", getOrders);

// GET single order
router.get("/:userId", getSingleOrder);

// POST single order
router.post("/", addOrder);

export default router;
