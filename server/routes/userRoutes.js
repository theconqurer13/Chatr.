import express from 'express';
import { updateProfile,getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/updateProfile',protect,updateProfile);
userRouter.get('/profile', protect, getProfile); 
export default userRouter;