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
export const login = async () => {};
export const authStatus = async () => {};
export const logout = async () => {};
export const setup2FA = async () => {};
export const verify = async () => {};
export const reset = async () => {};
