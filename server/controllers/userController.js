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

