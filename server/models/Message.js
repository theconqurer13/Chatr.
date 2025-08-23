import mongoose from "mongoose";
import { Chat } from "./Chat";
import { User } from "./User";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
