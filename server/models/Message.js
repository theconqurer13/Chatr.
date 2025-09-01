import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    read:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

