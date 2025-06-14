import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js"
import FriendRequest from "../models/friendRequest.model.js";

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "name profilePic nativeLanguage learningLanguage");
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server Error"
        });
    }
}

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {$id: {$nin: currentUser.friends}},
                {isOnboarding: true}
            ]
        })

        res.status(StatusCodes.OK).json(recommendedUsers)

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server Error",
        })
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        if(myId === recipientId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "You can't send friend request to yourself"
            });
        } 

        const recepient = await User.findById(recipientId);

        if(!recepient) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Recipient not found"
            });
        }

        if(recepient.friends.includes(myId)) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "You are already friends with this user"
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recepient: recipientId },
                { sender: recipientId, recepient: myId },
            ],
        });

        if(existingRequest) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "A friend request already exists between you and this user"
            });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(StatusCodes.CREATED).json(friendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error"
        })
    }
}