import express from "express";

// CONTROLLERS
import {
  getAllUsers,
  updateUserAddress,
  updateUserCredentials,
} from "../controllers/user.controller.js";

// Protect Route
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getAllUsers);

router.patch("/update-address", updateUserAddress);

router.patch("/update-credentials", updateUserCredentials);

export default router;
