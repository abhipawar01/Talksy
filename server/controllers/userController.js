import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Chat from "../models/Chat.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  console.log("📩 Incoming register body:", req.body);
  const { name, email, password } = req.body;

  try {
    // 1. Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 3. Create new user (schema middleware will hash password)
    const user = await User.create({ name, email, password });

    // 4. Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Incoming login body:", req.body);

  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log("✅ User found:", userExists.email);
    console.log("🔑 Plain password:", password);
    console.log("🔑 Hashed password in DB:", userExists.password);

    // Compare plain password with hashed password in DB
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userExists._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: userExists._id, name: userExists.name, email: userExists.email }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET USER =================
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET PUBLISHED IMAGES =================
export const getPublishedImags = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true
        }
      },
      {
        $project: {
          _id: 0,
          imageurl: "$messages.content",
          userName: "$userName"
        }
      }
    ]);

    return res.json({ success: true, images: publishedImageMessages.reverse() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
