import express from "express";
import { isAuthenticated } from "../utils/isauthenticated";
import { getMyFriends, getRecommendedUsers } from "../controllers/user.controller";

const router = express.Router();

router.get("/", isAuthenticated, getRecommendedUsers);
router.get("/friends", isAuthenticated, getMyFriends);
router.post("/friend-request/:id", isAuthenticated,)


export default router;