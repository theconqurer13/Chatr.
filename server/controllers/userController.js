import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { phoneNumber, location, bio, jobTitle, instagramLink, facebookLink } = req.body;

    // yaha tum apni DB me user find karke update karoge
    // maan lo userId token se aa raha hai
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber, location, bio, jobTitle, instagramLink, facebookLink },
      { new: true }
    );

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendFriendRequest = async (req,res)=>{
  try {
    const senderID = req.user.id;
    const receiverID = req.params.id;
    const receiver = await User.findById(receiverID);
    if(!receiver){
      return res.status(404).json({success:false,message:"User not found"});
    }
    if(receiver.friendRequests.includes(senderID)){
      return res.status(400).json({success:false,message:"Friend request already sent"});
    }
    receiver.friendRequests.push(senderID);
    await receiver.save();
    return res.status(200).json({success:true,message:"Friend request sent"});
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}

export const acceptFriendRequest = async (req,res)=>{
  try {
    const receiverID = req.user.id;
    const senderID = req.params.id;
    const receiver = await User.findById(receiverID);
    const sender = await User.findById(senderID);
    if(!sender){
      return res.status(404).json({success:false,message:"User not found"});
    }
    if(!receiver.friendRequests.includes(senderID)){
      return res.status(400).json({success:false,message:"Friend request not found"});
    }
    receiver.friends.push(senderID);
    sender.friends.push(receiverID);
    receiver.friendRequests.pull(senderID);

    await receiver.save();
    await sender.save();
   
    return res.status(200).json({success:true,message:"Friend request accepted"});
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}