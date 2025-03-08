import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
          isFaActive: false,
        });
        console.log('new user:', newUser)
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
        
    } catch (error) {
        res.status(500).json({error: "Error Registering User", message: error.message })
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
    if(req.user) {
       res.status(200).json({
         message: "User Logged In Successfully",
         email: req.user.email,
         isFaActive: req.user.isFaActive,
       });
    }
    else{
        res.status(400).json({
            message: "Unauthorized User"
        })
    }
};
export const logout = async () => {};
export const setup2FA = async () => {};
export const verify = async () => {};
export const reset = async () => {};
