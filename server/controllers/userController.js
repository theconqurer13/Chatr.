import User from "../models/User.js";


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
