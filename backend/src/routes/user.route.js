import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends ,sendfriendRequest ,acceptFriendRequest ,getOutgoingFriendRequests , getFriendRequests} from '../controller/user.controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendfriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.get("/friend-requests",getFriendRequests)
router.get("/outgoing-friend-requests",getOutgoingFriendRequests)

export default router;