import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      isFaActive: false,
    });
    console.log("new user:", newUser);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Registering User", message: error.message });
  }
};
export const login = async (req, res) => {
  console.log("The authenticated user is:", req.user);
  res.status(200).json({
    message: "User Logged In Successfully",
    email: req.user.email,
    isFaActive: req.user.isFaActive,
  });
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User Logged In Successfully",
      email: req.user.email,
      isFaActive: req.user.isFaActive,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized user",
    });
  } else {
    req.logout((err) => {
      if (err) {
        res.status(500).json({
          message: "Error Logging Out",
        });
      } else {
        res.status(200).json({
          message: "User Logged Out Successfully",
        });
      }
    });
  }
};

export const setup2FA = async (req, res) => {
  try {
    console.log("the user is:", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("The secret is:", secret);
    user.twoFactorSecret = secret.base32;
    user.isFaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: user.email,
      issuer: "TaskFlow@gmail.com",
      encoding: "base32",
    });
    const qrImg = await QRCode.toDataURL(url);
    res.json({ qrCode: qrImg, secret: secret.base32 });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error setting up 2FA", message: error.message });
  }
};
export const verify = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
    });
    
    // console.log("Verification attempt:", {
    //   secret: user.twoFactorSecret,
    //   token: token,
    //   verified: verified
    // });

    if (verified) {
      const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "2FA Verified Successfully", token: jwtToken });
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (error) {
    // console.error("2FA Verification error:", error);
    res.status(500).json({ error: "Error verifying 2FA", message: error.message });
  }
};
export const reset = async (req,res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.isFaActive = false;
        await user.save();
        res.status(200).json({message: "2FA Reset Successfully"});
    } catch (error) {
        res.status(500)
      .json({ error: "Error resetting 2FA", message: error.message });
    }
};
