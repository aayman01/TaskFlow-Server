import { Router } from "express";
import passport from "passport";
import {
  authStatus,
  login,
  verifyEmailCode,
  logout,
  register,
  reset,
  setup2FA,
  verify,
} from "../controllers/authController.js";

const router = Router();

// Registration route
router.post("/register", register);

// Login route - starts the process
router.post("/login", passport.authenticate("local"), login);

// Email verification route
router.post(
  "/verify-email",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  verifyEmailCode
);

// auth status route
router.get("/status", authStatus);

// log out route
router.post("/logout", logout);

// 2Fa setup
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized setup" });
  },
  setup2FA
);

// 2FA verification route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized verify" });
  },
  verify
);
// reset
router.post("/2fa/reset", reset);

export default router;
