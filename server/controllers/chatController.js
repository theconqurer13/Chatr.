import Chat from "../models/Chat.js";
import User from "../models/User.js";


export const createChat = async (req,res)=>{
    try {
        const user = req.userId;
        const friendId = req.body.friendId;
        let chat = await Chat.findOne({members:{$all:[user,friendId]}});
        if(chat){
            return res.status(200).json({success:true,message:"Chat already exists",data:chat});
        }
        chat = await Chat.create({members:[user,friendId]});
        res.status(200).json({success:true,message:"Chat created successfully",data:chat});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

export const getChats = async (req,res)=>{
    try {
        const chats = await Chat.find({members:{$in:req.userId}}).populate("members").populate("lastMessage").sort({updatedAt:-1});
        res.status(200).json({success:true,message:"Chats fetched successfully",data:chats});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}
