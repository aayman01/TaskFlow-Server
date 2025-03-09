import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayman.alfi098@gmail.com",
    pass: "kbetcbobzftnbcjk",
  },
});


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      isFaActive: false,
    });
    // console.log("new user:", newUser);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Registering User", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = req.user;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log("the verification code is:", verificationCode);
    // console.log("the user is:", user);
    user.emailVerificationCode = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000)
    };
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Login Verification Code",
      text: `Your verification code is: ${verificationCode}. This code will expire in 2 minutes.`,
    });

    res.status(200).json({
      message: "Please check your email for verification code",
      email: user.email,
      requiresEmailVerification: true
    });
  } catch (error) {
    res.status(500).json({ error: "Error in login process", message: error.message });
  }
};

// verify email code
export const verifyEmailCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user;

    if (!user.emailVerificationCode || !user.emailVerificationCode.code) {
      return res.status(400).json({ message: "No verification code found" });
    }

    if (Date.now() > user.emailVerificationCode.expiresAt) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    if (code !== user.emailVerificationCode.code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.emailVerificationCode = undefined;
    user.isEmailVerified = true;
    await user.save();


    if (user.isFaActive) {
      return res.status(200).json({
        message: "Email verified. Please enter your 2FA code",
        requires2FA: true,
        email: user.email
      });
    }

    const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Code verified successfully",
      token: jwtToken,
      user: {
        email: user.email,
        isFaActive: user.isFaActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code", message: error.message });
  }
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
      message: "No User Logged In",
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
    // console.log("the user is:", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    // console.log("The secret is:", secret);
    user.twoFactorSecret = secret.base32;
    user.isFaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: user.email,
      issuer: "TaskFlow",
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

// verify 2fa code
export const verify = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: String(token),
      window: 2
    });

    if (verified) {
      const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ 
        message: "2FA Verified Successfully", 
        token: jwtToken,
        user: {
          email: user.email,
          isFaActive: user.isFaActive,
          isEmailVerified: user.isEmailVerified
        }
      });
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (error) {
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
