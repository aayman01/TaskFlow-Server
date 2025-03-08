import { Router } from "express";
import passport from "passport";
import { authStatus, login, logout, register, reset, setup2FA, verify } from "../controllers/authController.js";

const router = Router();

// Registration route
router.post("/register", register);
// login route
router.post("/login", passport.authenticate("local"), login);
// auth status route
router.get("/status", authStatus);
// log out route
router.post("/logout", logout); 

// 2Fa setup
router.post("/2fa/setup",(req, res, next) =>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message: "Unauthorized"});
} ,setup2FA);

// verify route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  verify
);
// reset
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  },
  reset
);

export default router;
