import mongoose from "mongoose";
import { Message } from "./Message";
import { User } from "./User";

const chatSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Message",
    },
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);