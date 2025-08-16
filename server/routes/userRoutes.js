import express from 'express';
import { setProfileData } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/updateProfile',protect,setProfileData);

export default userRouter;