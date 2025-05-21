import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { StatusCodes } from 'http-status-codes';

export const isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies;

        if(!token) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Not Logged In",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded._id);
        next();

    } catch (error) {
        console.log(error);
    }
}