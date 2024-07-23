import express from "express";

// Controllers
import {
  addSingleProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:productId", getSingleProduct);

// POST single product
router.post("/", addSingleProduct);

export default router;
