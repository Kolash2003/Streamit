import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statuscode = StatusCodes.ACCEPTED) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statuscode).cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 60 * 60 * 1000,
    }).json({
        success: true,
        message
    })
}