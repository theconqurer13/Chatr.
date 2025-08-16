import express from 'express';
import { setProfileData } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post('/',protect,setProfileData);

export default userRouter;