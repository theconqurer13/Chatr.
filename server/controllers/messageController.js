import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
export const message = async (req,res)=>{
    try {
        const senderId = req.body.senderId;
        const chatId = req.body.chatId;
        // store new message in message collection
        const message = req.body.message;
        const newMessage = await Message.create({sender:senderId,chatId,text:message});
        // update last message in chat collection
        const currentChat = await Chat.findById(chatId);
        currentChat.lastMessage = newMessage._id;
        currentChat.unreadMessageCount = (currentChat.unreadMessageCount || 0) + 1;
        await currentChat.save();

        res.status(201).json({success:true,message:"Message sent successfully",data:newMessage});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export const getAllMessages = async (req,res)=>{
    try {
        const chatId = req.params.chatId;
        const allMessages = await Message.find({chatId:chatId}).populate("sender").sort({createdAt:1});
        res.status(200).json({success:true,message:"Messages fetched successfully",data:allMessages});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}