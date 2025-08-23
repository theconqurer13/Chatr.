import User from "../models/User.js";

export const getPendingRequests = async (req,res)=>{
  try {
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({success:false,message:"User not found"});
    }
    const pendingRequests = user.friendRequests;
    if(pendingRequests.length === 0){
      return res.status(200).json({success:true,message:"No pending requests"});
    }
    const pendingRequestsData = await User.find({_id:{$in:pendingRequests}});
    return res.status(200).json({success:true,pendingRequestsData});
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}