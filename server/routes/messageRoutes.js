import express from "express";
import { message } from "../controllers/messageController.js";
import { getAllMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/send-message",message);
messageRouter.get("/get-all-messages/:chatId",getAllMessages);  
export default messageRouter;
