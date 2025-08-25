import express from 'express';
import { updateProfile,getProfile,sendFriendRequest,acceptFriendRequest, searchUser, getUser  } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/updateProfile',protect,updateProfile);
userRouter.get('/profile', protect, getProfile);
userRouter.post('/:id/sendFriendRequest', sendFriendRequest);
userRouter.post('/:id/acceptFriendRequest', protect, acceptFriendRequest);
userRouter.post('/search-user',protect,searchUser);
userRouter.get('/profile/pending-request/:id',protect,getUser);
export default userRouter;