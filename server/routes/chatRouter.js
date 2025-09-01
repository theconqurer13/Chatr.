import express from "express";
import { createChat, getChats } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
const chatRouter = express.Router();
chatRouter.post("/create-chat",protect,createChat);
chatRouter.get("/get-chats",protect,getChats);

export default chatRouter;
