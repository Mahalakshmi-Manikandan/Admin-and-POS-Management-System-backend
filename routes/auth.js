import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

/* ===== LOGIN & REGISTER (RATE LIMITED) ===== */
router.post(
  "/register",
  authLimiter,
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["user", "admin"]),
  ],
  register
);

router.post(
  "/login",
  authLimiter,
  [body("email").isEmail(), body("password").notEmpty()],
  login
);

/* ===== REFRESH TOKEN (NO RATE LIMIT) ===== */
router.post("/refresh-token", body("refreshToken").exists(), refreshToken);

/* ===== PASSWORD ===== */
router.post(
  "/forgot-password",
  authLimiter,
  body("email").isEmail(),
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  [body("token").exists(), body("password").isLength({ min: 6 })],
  resetPassword
);

export default router;
