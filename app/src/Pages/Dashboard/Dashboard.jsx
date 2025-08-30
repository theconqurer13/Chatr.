import React, { useEffect, useState } from "react";
import { Edit2, Check, X, Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const { user, token, axios, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("Never changed");
  
  const lastChanged = user?.passwordUpdatedAt;
  
  useEffect(() => {
    if (lastChanged) {
      const date = new Date(lastChanged);
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diff === 0) setDisplayText("Changed today");
      else if (diff === 1) setDisplayText("Changed 1 day ago");
      else setDisplayText(`Changed ${diff} days ago`);
    }
  }, [lastChanged]);

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  // Static data for fields not available from user object
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    location: "",
    bio: "",
    jobTitle: "",
    instagramLink: "",
    facebookLink: "",
    imageUrl: "",
  });

  // Form state initialized with user and static data
  const [editForm, setEditForm] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    ...profileData,
  });

  // Update form state if user data loads after initial render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setProfileData(res.data.data);
          setEditForm((prev) => ({
            ...prev,
            name: user?.fullName || "",
            email: user?.email || "",
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.error(err);
      }finally{
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, token]);

  
  // Save profile handler
  const handleSave = async () => {
    try {
      // Create FormData for file upload
      setLoading(true);
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('email', editForm.email);
      formData.append('phoneNumber', editForm.phoneNumber);
      formData.append('location', editForm.location);
      formData.append('bio', editForm.bio);
      formData.append('jobTitle', editForm.jobTitle);
      formData.append('instagramLink', editForm.instagramLink);
      formData.append('facebookLink', editForm.facebookLink);
      
      // Only append image if a new one was selected
      if (previewImage) {
        formData.append('imageUrl', previewImage);
      }

      const res = await axios.post(
        "/api/user/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        // Update profile data with response data
        setProfileData({
          ...editForm,
          imageUrl: res.data.data.imageUrl || profileData.imageUrl
        });
        
        // Update user context with new data
        setUser(res.data.data);
        
        setIsEditing(false);
        setPreviewImage(null); // Clear preview
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }finally{
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.fullName || "",
      email: user?.email || "",
      ...profileData,
    });
    setIsEditing(false);
  };
  if(loading){
    return <Loader/>
  }
  return (
    <div className="space-y-6">
      {/* --- Profile Information Card --- */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                className="flex flex-1 sm:flex-initial items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors duration-200 justify-center"
              >
                <X size={16} />
                <span className="hidden sm:inline">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex flex-1 sm:flex-initial items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 justify-center"
              >
                <Check size={16} />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img
                  src={previewImage ? URL.createObjectURL(previewImage) : user?.imageUrl}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500"
                />
                {isEditing && (
                  <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors" >
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <input type="file" id="profileImage" className="hidden" onChange={(e)=>{setPreviewImage(e.target.files[0])
                        setEditForm({
                          ...editForm,
                          imageUrl:e.target.files[0]
                        })
                      }}/>
                      <Edit2 size={16} />
                    </label>
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="text-xl font-semibold text-white text-center bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none px-2 py-1 w-full max-w-xs"
                />
              ) : (
                <h3 className="text-xl font-semibold text-white">
                  {user?.fullName}
                </h3>
              )}
              
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4">
              {["email", "phoneNumber", "location"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">
                    {field}
                  </label>
                  {isEditing ? (
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={editForm[field] || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [field]: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      readOnly={field === "email"} // Email not editable
                    />
                  ) : (

                     <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg">
                        
                        <span className="text-gray-300">
                          {field === "email"
                        ? user?.email
                        : profileData[field] || `no ${field} added`}
                        </span>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              ) : (
                <div className="w-full p-4 bg-gray-800/60 border border-gray-700 rounded-lg">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {profileData.bio || "No bio added yet."}
                  </p>
                </div>
              )}
            </div>
            {/* {job title} */}
            <div className="pt-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
                Job Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.jobTitle}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-200">{profileData.jobTitle || "No job title added yet."}</p>
              )}
            </div>  
            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Social Links
              </h4>
              <div className="space-y-4">
                {/* Instagram */}
                <div>
                 
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.instagramLink}
                      onChange={(e) =>
                        setEditForm({ ...editForm, instagramLink: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-indigo-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    profileData.instagramLink ? (
                      <a
                        href={profileData.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Instagram size={18} />
                        <span>{profileData.instagramLink}</span>
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">No Instagram linked</p>
                    )
                  )}
                </div>

                {/* Facebook */}
                <div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.facebookLink}
                      onChange={(e) =>
                        setEditForm({ ...editForm, facebookLink: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-indigo-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    profileData.facebookLink ? (
                      <a
                        href={profileData.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Facebook size={18} />
                        <span>{profileData.facebookLink}</span>
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">No Facebook linked</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Account Security Card --- */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Account Security
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-700 rounded-lg gap-3">
            <div>
              <p className="font-medium text-gray-200">Password</p>
              <p className="text-sm text-gray-400"> {displayText}</p>
            </div>
            <button  onClick={() => console.log("Change Password")} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors self-start sm:self-center">
              Change Password
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-700 rounded-lg gap-3">
            <div>
              <p className="font-medium text-gray-200">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-400">
                Enhanced security for your account
              </p>
            </div>
            <span className="bg-indigo-500 bg-opacity-20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
              Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
