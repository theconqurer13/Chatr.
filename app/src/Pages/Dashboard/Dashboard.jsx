import React, { useEffect, useState } from "react";
import { Edit2, Check, X ,Instagram, Facebook,Phone, Mail, MapPin,} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useClerk} from "@clerk/clerk-react";
const Dashboard = () => {
  const { user, getToken, axios } = useAppContext();
  // account section
  const { openUserProfile } = useClerk();
  const lastChanged = user.passwordUpdatedAt;
  const [displayText,setDisplayText] = useState("Never changed");
   if (lastChanged) {
    const date = new Date(lastChanged);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // difference in days

    if (diff === 0) setDisplayText("Changed today");
    else if (diff === 1) setDisplayText("Changed 1 day ago");
    else setDisplayText(`Changed ${diff} days ago`) ;
  }



  
  const [isEditing, setIsEditing] = useState(false);

  // Static data for fields not available from Clerk user object
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    location: "",
    bio: "",
    jobTitle: "",
    instagramLink: "",
    facebookLink: "",
  });

  // Form state initialized with Clerk and static data
  const [editForm, setEditForm] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    ...profileData,
  });

  // Update form state if user data loads after initial render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if (res.data.success) {
          setProfileData(res.data.data);
          setEditForm((prev) => ({
            ...prev,
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  // Save profile handler
  const handleSave = async () => {
    try {
      const res = await axios.post(
        "/api/user/updateProfile",
        {
          phoneNumber: editForm.phoneNumber,
          location: editForm.location,
          bio: editForm.bio,
          jobTitle: editForm.jobTitle,
          instagramLink: editForm.instagramLink,
          facebookLink: editForm.facebookLink,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (res.data.success) {
        setProfileData(editForm);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      ...profileData,
    });
    setIsEditing(false);
  };

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
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500"
                />
                {isEditing && (
                  <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                    <Edit2 size={16} />
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
                      readOnly={field === "email"} // Clerk email not editable
                    />
                  ) : (

                     <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg">
                        
                        <span className="text-gray-300">
                          {field === "email"
                        ? user?.primaryEmailAddress?.emailAddress
                        : profileData[field]}
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
                <p className="text-gray-200">{profileData.jobTitle}</p>
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
            <button  onClick={() => openUserProfile()} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors self-start sm:self-center">
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
