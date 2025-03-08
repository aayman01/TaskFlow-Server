import { Router } from "express";
import passport from "passport";
import { authStatus, login, logout, register, reset, setup2FA, verify } from "../controllers/authController.js";

const router = Router();

// Registration route
router.post("/register", register);
// login route
router.post("/login", passport.authenticate("local"), login);
// auth status route
router.post("/status", authStatus);
// log out route
router.post("/logout", logout);
// 2Fa setup
router.post("/2fa/setup", setup2FA);
// verify route
router.post("/2fa/verify", verify);
// reset
router.post("/2fa/reset", reset);

export default router;
