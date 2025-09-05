import User from "../models/User.js";
import mongoose from "mongoose";

export const friends = async (req,res)=>{
    try {
        const user = await User.findById(req.userId);
        const friends = user.friends || [];
        
        // Convert string IDs to ObjectIds
        const friendObjectIds = friends.map(id => new mongoose.Types.ObjectId(id));
        
        const friendsData = await User.find({
            _id: { $in: friendObjectIds }
        });
        
        if(friendsData.length === 0){
            return res.status(200).json({success:true, message:"No friends found. Add some friends!"});
        }
        
        return res.status(200).json({
            success: true,
            friendsData: friendsData.map(friend => ({
                _id: friend._id,
                name: friend.name,
                email: friend.email,
                imageUrl: friend.imageUrl,
                online: friend.online || false
            }))
        });
    } catch (error) {
        console.error("Error in friends controller:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}