import User from "../models/User";


export const setProfileData = async (req,res)=>{
    try {
        const {name,email,phoneNumber,location,bio,instagramLink,facebookLink,jobTitle} = req.body;
        const user = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(user,
            {$set:
                {name,
                email,
                phoneNumber,
                location,
                bio,
                instagramLink,
                facebookLink,
                jobTitle
            }},{new:true});
             if (!updatedUser) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found"});
                }
            res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
            });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Profile Update failed ",error:error.message});
    }
}