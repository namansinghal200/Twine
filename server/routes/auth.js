import express from "express";
import { check } from "express-validator";
import { registerUser, loginUser, getUser } from "../controllers/auth.js";

const router = express.Router();

// Register user
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("avatar", "Avatar is required").not().isEmpty(),
  ],
  registerUser
);

// Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

router.get("/users/:id", getUser);

export default router;
