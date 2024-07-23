import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import multer from "multer";

// ROUTES IMPORTS
import AuthRoute from "./routes/auth.routes.js";
import ProductRoute from "./routes/product.routes.js";
import CartRoute from "./routes/cart.routes.js";
import OrderRoute from "./routes/order.routes.js";
import ReviewRoute from "./routes/review.routes.js";
import SizeRoute from "./routes/size.routes.js";
import ColorRoute from "./routes/color.routes.js";
import CategoryRoute from "./routes/category.routes.js";
import UserRoute from "./routes/user.routes.js";

// APP
const app = express();

// CONFIG
dotenv.config();

// ENV Varibales
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

// MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// MIDDLEWARES
app.use(cookieParser());
app.use(express.static("./"));
app.use(express.json());

// ROUTES
app.use("/api/auth", AuthRoute);
app.use("/api/carts", CartRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/colors", ColorRoute);
app.use("/api/sizes", SizeRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/user", UserRoute);

app.use("/api/products", upload.single("productPic"), ProductRoute);

app.listen(PORT, () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log(`Database connected and server is lsitening or ${PORT}`);
    })
    .catch((error) => {
      console.log(error);
    });
});
