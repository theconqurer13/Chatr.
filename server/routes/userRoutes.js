import express from 'express';
import { updateProfile,getProfile,sendFriendRequest,acceptFriendRequest  } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/updateProfile',protect,updateProfile);
userRouter.get('/profile', protect, getProfile);
userRouter.post('/:id/sendFriendRequest', protect, sendFriendRequest);
userRouter.post('/:id/acceptFriendRequest', protect, acceptFriendRequest);
export default userRouter;