import User from "../models/User.js";

export const friends = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        const friends = user.friends;
        const friendsData = await User.find({_id:{$in:friends}});
        if(friendsData.length === 0){
            return res.status(200).json({success:true,message:"Add some friends"});
        }
        return res.status(200).json({success:true,friendsData});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}