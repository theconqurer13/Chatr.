import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: {
        type: [String],
        ref: "User",
        required: true,
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Message",
    },
    unreadMessageCount:{
         type:Number,
         default:0
    }
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);