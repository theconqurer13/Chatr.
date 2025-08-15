import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    phoneNumber :{type:Number},
    location:{type:String,required:true},
    bio:String,
    instagramLink:String,
    facebookLink:String,
    jobTitle:String
},{timestamp:true});


const User = mongoose.model("User",userSchema);

export default User;