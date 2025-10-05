import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ error: { code: "FIELD_REQUIRED", field: "email" } });

  const user = await User.create({ name, email, password, role });
  res.json({ id: user._id });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: { code: "INVALID_USER" } });
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ error: { code: "INVALID_PASSWORD" } });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

export default router;
