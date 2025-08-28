import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String }, // ✅ String instead of Number
  location: { type: String },
  bio: String,
  instagramLink: String,
  facebookLink: String,
  jobTitle: String,
  image: { type: String },
  friends: [{ type: String, ref: "User" }], // ✅ removed unique:true
  friendRequests: [{ type: String, ref: "User" }], // ✅ removed unique:true
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
