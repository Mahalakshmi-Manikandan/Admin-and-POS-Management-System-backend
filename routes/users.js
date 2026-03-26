import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";

import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/userController.js";

const router = express.Router();

/* ------------------ ADMIN ROUTES ------------------ */
// /api/users/list
router.get("/list", authenticateToken, requireRole("admin"), listUsers);

// /api/users/create
router.post("/create", authenticateToken, requireRole("admin"), createUser);

// /api/users/update/:id
router.put("/update/:id", authenticateToken, requireRole("admin"), updateUser);

// /api/users/delete/:id
router.delete("/delete/:id", authenticateToken, requireRole("admin"), deleteUser);


/* ------------------ PROFILE ROUTES ------------------ */
// /api/users/profile
router.get("/profile", authenticateToken, getProfile);

// /api/users/profile
router.put("/profile", authenticateToken, updateProfile);

// /api/users/profile/change-password
router.post("/profile/change-password", authenticateToken, changePassword);

export default router;
