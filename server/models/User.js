import mongoose from "mongoose";


const userSchema =  mongoose.Schema({
    _id:{type:String,required:true},
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    phoneNumber :{type:Number},
    location:{type:String},
    bio:String,
    instagramLink:String,
    facebookLink:String,
    jobTitle:String,
    image:{type:String,required:true},
    friends:[{type:String,ref:'User'}],
    friendRequests:[{type:String,ref:'User'}]
},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;