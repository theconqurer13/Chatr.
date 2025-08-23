import express from "express";
import { friends } from "../controllers/friendsController.js";
import { protect } from "../middleware/authMiddleware.js";
const friendsRouter = express.Router();

friendsRouter.get('/', protect, friends);

export default friendsRouter;