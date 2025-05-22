import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statuscode = StatusCodes.ACCEPTED) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statuscode).cookie("token", token, {
        httpOnly: true, // prevents XXS attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    }).json({
        success: true,
        message
    });
}