import bcrypt from "bcrypt";
import User from "../models/user.js";

const SALT_ROUNDS = 10;

/* =======================
      USER PROFILE
======================= */

// Get logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "email", "name", "role", "status", "createdAt"],
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (name + password)
export const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (password)
      user.password = await bcrypt.hash(password, SALT_ROUNDS);

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
      CHANGE PASSWORD
======================= */

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ error: "Current and new passwords are required." });

    const user = await User.findByPk(req.user.id);

    if (!user)
      return res.status(404).json({ error: "User not found." });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res
        .status(401)
        .json({ error: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};


/* =======================
      ADMIN ROUTES
======================= */

// List all users
export const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "name", "role", "status", "createdAt"],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // Check duplicate email
    const exist = await User.findOne({ where: { email } });
    if (exist)
      return res
        .status(400)
        .json({ message: "Email is already registered" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      email,
      password: hashed,
      name,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update any user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, status, password } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Prevent duplicate email
    if (email && email !== user.email) {
      const exist = await User.findOne({ where: { email } });
      if (exist)
        return res
          .status(400)
          .json({ message: "Email already in use" });
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status !== undefined) user.status = status;

    if (password)
      user.password = await bcrypt.hash(password, SALT_ROUNDS);

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Protect admin from deleting their own account
    if (req.user.id == id)
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
