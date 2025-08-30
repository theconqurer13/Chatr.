import express from 'express';
import { updateProfile,getProfile,sendFriendRequest,acceptFriendRequest, searchUser, getUser ,rejectFriendRequest } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/updateProfile', protect, upload.single('imageUrl'), updateProfile);
userRouter.get('/profile', protect, getProfile);
userRouter.post('/:id/sendFriendRequest',protect, sendFriendRequest);
userRouter.post('/:id/acceptFriendRequest', protect, acceptFriendRequest);
userRouter.post('/:id/declineFriendRequest', protect, rejectFriendRequest);
userRouter.post('/search-user',protect,searchUser);
userRouter.get('/profile/pending-request/:id',protect,getUser);
export default userRouter;