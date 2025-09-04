import User from "../models/User.js";
import {v2 as cloudinary} from "cloudinary";
import "../configs/cloudinary.js"; // Ensure cloudinary is configured

export const updateProfile = async (req, res) => {
  try {
    const { phoneNumber, location, bio, jobTitle, instagramLink, facebookLink,name,email } = req.body;
    let imageUrl = null;
    
    // yaha tum apni DB me user find karke update karoge
    // maan lo userId token se aa raha hai
    const userId = req.userId;
    
    if(req.file){
      // Upload buffer directly to cloudinary (memory storage)
      const result = await cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "profile_photos" // Optional: organize uploads in a folder
        },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );
      
      // Convert buffer to base64 data URL for cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "profile_photos"
      });
      
      imageUrl = uploadResult?.secure_url;
    }
    
    // Only update imageUrl if a new image was uploaded
    const updateData = { phoneNumber, location, bio, jobTitle, instagramLink, facebookLink,name,email};
    if (imageUrl) {
      updateData.imageUrl = imageUrl;

    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({success:true,data:user});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendFriendRequest = async (req,res)=>{
  try {
    const senderID = req.userId;
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
    const receiverID = req.userId;
    const senderID = req.params.id;
    
    console.log('Accept request - ReceiverID:', receiverID, 'SenderID:', senderID);
    
    const receiver = await User.findById(receiverID);
    const sender = await User.findById(senderID);
    
    if(!sender){
      return res.status(404).json({success:false,message:"User not found"});
    }
    
    if(!receiver){
      return res.status(404).json({success:false,message:"Receiver not found"});
    }
    
    if(!receiver.friendRequests.includes(senderID)){
      return res.status(400).json({success:false,message:"Friend request not found in your requests"});
    }
    
    // Check if already friends
    if(receiver.friends.includes(senderID)){
      return res.status(400).json({success:false,message:"Already friends"});
    }
    
    receiver.friends.push(senderID);
    sender.friends.push(receiverID);
    receiver.friendRequests.pull(senderID);

    await receiver.save();
    await sender.save();
   
    return res.status(200).json({success:true,message:"Friend request accepted"});
  } catch (error) {
    console.error('Accept friend request error:', error);
    return res.status(500).json({success:false,message:error.message});
  }
}

export const rejectFriendRequest = async (req,res)=>{
  try {
    const receiverID = req.userId;
    const senderID = req.params.id;
    const receiver = await User.findById(receiverID);
    const sender = await User.findById(senderID);
    
    if(!sender){
      return res.status(404).json({success:false,message:"User not found"});
    }
    
    if(!receiver.friendRequests.includes(senderID)){
      return res.status(400).json({success:false,message:"Friend request not found"});
    }
    
    // Remove the friend request
    receiver.friendRequests.pull(senderID);
    await receiver.save();
   
    return res.status(200).json({success:true,message:"Friend request rejected"});
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}

export const searchUser = async (req,res)=>{
  try {
    const parameter = req.body.parameter;
    const userId = req.userId;
    const users = await User.find({$or:[
      {name:{$regex:parameter,$options:'i'}},
      {email:{$regex:parameter,$options:'i'}},
    ]});
    const filteredUsers = users.filter(user => user._id.toString() !== userId);
    res.status(200).json({
      success:true,
      data:filteredUsers
    })
  } catch (error) {
    return res.status(500).json({success:false,message:error.message});
  }
}