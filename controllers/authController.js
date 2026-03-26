import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/auth.js";

const SALT_ROUNDS = 10;

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};





/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.APP_BASE_URL}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: `<a href="${resetLink}">Reset Password</a>`,
    });

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    jwt.verify(token, process.env.JWT_RESET_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.password = await bcrypt.hash(password, SALT_ROUNDS);
      await user.save();

      res.json({ message: "Password updated successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
