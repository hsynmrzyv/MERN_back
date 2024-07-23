import express from "express";

// Protect Route
import { protectRoute } from "../middlewares/protectRoute.js";

// Controllers
import {
  addCart,
  getCart,
  removeCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protectRoute);

// GET Cart
router.get("/", getCart);

// POST single Cart
router.post("/", addCart);

// DELETE Cart Item
router.delete("/", removeCartItem);

export default router;
