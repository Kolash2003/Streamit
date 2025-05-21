import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import status from "http-status-codes";


export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Enter all the details",
            });
        }

        let user = User.findOne({email}).select("+password");

        if(!user) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Incorrect email or Password",
            })
        }

        sendCookie(user, res, `Welcome back ${user.username}`);
    } catch (error) {
        console.log(error);
    }
}

export const logoutController = (req, res) => {
    res.status(status.ACCEPTED).cookie("token", "", {
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Loggedout sucessfully",
    })
}

export const signupController = async (req, res) => {
    const {username, email, password, name} = req.body;

    if(!username || !email || !password || !name) {
        return res.staus(status.NOT_FOUND).json({
            success: false,
            message: "Fill all the details for Signup",
        })
    }

    let user = User.findOne({email});

    if(user) {
        return res.status(status.NOT_ACCEPTABLE).json({
            success: false,
            message: "User already exists",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
}