import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import status, { StatusCodes } from "http-status-codes";
import { sendCookie } from '../utils/features.js';
import { upsertStreamUser } from '../lib/stream.js';

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Enter all the details",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(status.FORBIDDEN).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Invalid User or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        sendCookie(user, res, `Welcome back ${user.username}`);
    } catch (error) {
        console.error(error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const logoutController = (req, res) => {
    res.status(status.ACCEPTED)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
};

export const signupController = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Fill all the details for signup",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(status.FORBIDDEN).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(status.NOT_ACCEPTABLE).json({
                success: false,
                message: "User already exists",
            });
        }

        const index = Math.floor(Math.random() * 100) + 1; // generate number between 1 and 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.name,
                image: user.profilePic || "",
            });
            console.log(`Stream user created for ${user.name}`);
        } catch (error) {
            console.log("Error creating stream user:", error);
        }
 
        sendCookie(user, res, `Registered successfully`, StatusCodes.ACCEPTED);
    
    } catch (error) {
        console.error(error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Signup failed",
        });
    }
};
