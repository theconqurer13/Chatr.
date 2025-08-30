import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password:{type:String,required:true},
  phoneNumber: { type: String }, // String instead of Number
  location: { type: String },
  bio: String,
  instagramLink: String,
  facebookLink: String,
  jobTitle: String,
  imageUrl: { type: String }, // Changed from 'image' to 'imageUrl'
  friends: [{ type: String, ref: "User" }], 
  friendRequests: [{ type: String, ref: "User" }],
  isAccepted:{type:String,enum:["pending","accepted"],default:"pending"}, 
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
