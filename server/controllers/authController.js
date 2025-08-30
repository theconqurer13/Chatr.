import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        // if the user already exist
        const person = await User.findOne({email});
        if(person){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })

        // Remove password from response
        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        return res.status(201).json({success:true,message:"User created successfully",data:userResponse})
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const login = async (req,res)=>{
    try {
        const person = await User.findOne({email:req.body.email});
        if(!person){
            return res.status(404).json({
                success:false,
                message:"User does not exist"
            })
        }

        // checking password is right or wrong
        const isPasswordCorrect = await bcrypt.compare(req.body.password,person.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            })
        }

        // Generate JWT token
        const token = jwt.sign({
            userId:person._id,
            email:person.email,
            name:person.name
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"1d"
        });

        // Remove password from user object
        const userResponse = { ...person.toObject() };
        delete userResponse.password;

        return res.status(200).json({
            success:true,
            message:"Login successful",
            token:token,
            user:userResponse
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false
        })
    }
}