import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Cart from "../model/cart.model.js";

// NODEMAILER
import nodemailer from "nodemailer";

// BCRYPT
import bcrypt from "bcrypt";

// TOKEN
import { generateTokenAndSetCookie } from "../generateTokenAndSetCookie.js";

// Transport
const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "055eaec538758b3cdca66f8b2e15dfff",
  },
});

export const signup = async (request, response) => {
  const { fullName, password, email } = request.body;

  // Check empty fields
  if (!email || !fullName || !password) {
    return response
      .status(404)
      .send({ error: "Please fill all required fields" });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return response.status(404).send({ error: "Email already in use" });
  }

  // HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  if (!newUser) {
    return response.status(404).send({ error: "User not created" });
  }

  await Cart.create({ userId: newUser._id, cartItems: [] });
  await Order.create({ userId: newUser._id, totalPrice: 0, orderItems: [] });

  generateTokenAndSetCookie(newUser._id, response);
  response.status(201).send(newUser);
};

export const signin = async (request, response) => {
  const { email, password } = request.body;

  // Check empty fields
  if (!email || !password) {
    return response
      .status(404)
      .send({ error: "Please fill all required fields" });
  }

  const user = await User.findOne({ email });

  let isCorrectPassword;

  if (user) {
    // Check password is correct
    isCorrectPassword = await bcrypt.compare(password, user?.password);
  }

  if (!isCorrectPassword || !user) {
    return response.status(404).send({ error: "Incorrect password or email" });
  }

  generateTokenAndSetCookie(user._id, response);
  response.status(200).send(user);
};

export const logout = async (request, response) => {
  response.cookie("jwt", "");
  response.status(200).send({ message: "Logged out successfully" });
};

export const resetPassword = async (request, response) => {
  const { email, newPassword, confirmPassword } = request.body;

  // Check empty values
  if (!email || !newPassword || !confirmPassword) {
    return response.status(404).send({ error: "Please fill all fields" });
  }

  // Check existing email
  const user = await User.findOne({ email });

  if (!user) {
    return response.status(404).send({ error: "Email not found!" });
  }

  // Check matching passwords
  if (newPassword !== confirmPassword) {
    return response.status(404).send({ error: "Password do not match" });
  }

  // HASH the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (!updatedUser) {
    return response.status(404).send({ error: "Couln't update the password" });
  }

  return response.status(202).send(updatedUser);
};

export const forgetPassword = async (request, response) => {
  const { email } = request.body;

  // Check empty values
  if (!email) {
    return response
      .status(404)
      .send({ error: "Please fill all required fields" });
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return response
      .status(404)
      .send({ error: "You are not signed up. Please create an account" });
  }

  transport.sendMail({
    from: "info@demomailtrap.com",
    to: email,
    subject: "Forget Password",
    html: "<a href='http://localhost:3000/reset-password'>Reset Password Link</a>",
  });
};
