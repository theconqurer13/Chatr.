import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    members: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        required: true,
    },
    messages: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            }
        ],
        
    },
    unreadMessageCount:{
         type:Number,
         default:0
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
}, { timestamps: true });

 const Chat = mongoose.model("Chat", chatSchema);
 export default Chat;