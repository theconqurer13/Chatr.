import express from 'express';
import { setProfileData, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/updateProfile',protect,updateProfile);

export default userRouter;