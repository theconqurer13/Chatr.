import React from "react";
import { 
  User, 
  MessageCircle, 
  Bell, 
  LogOut,
  Edit2,
  Check,
  X
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Static data for fields not available from Clerk user object
  const [profileData, setProfileData] = React.useState({
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Product designer passionate about creating intuitive user experiences. Coffee enthusiast and amateur photographer.',
    jobTitle: 'Senior Product Designer'
  });

  // Form state initialized with Clerk and static data
  const [editForm, setEditForm] = React.useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    ...profileData
  });

  // Update form state if user data loads after initial render
  React.useEffect(() => {
    setEditForm(prevForm => ({
      ...prevForm,
      name: user?.fullName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
    }));
  }, [user]);

  const handleSave = () => {
    // Here you would typically send the 'editForm' data to your backend API
    setProfileData({
      phone: editForm.phone,
      location: editForm.location,
      bio: editForm.bio,
      jobTitle: editForm.jobTitle
    });
    // For Clerk user properties, you would call user.update()
    // Example: user.update({ fullName: editForm.name });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original data
    setEditForm({
      name: user?.fullName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
      ...profileData
    });
    setIsEditing(false);
  };

  return (
    // Responsive spacing for the entire component
    <div className="space-y-6 ">
      
      {/* --- Profile Information Card --- */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        
        {/* Card Header: Stacks on mobile, row on larger screens */}
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

        {/* Main Grid: 1 column on mobile/tablet, 2 on desktop */}
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
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="text-xl font-semibold text-white text-center bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none px-2 py-1 w-full max-w-xs"
                />
              ) : (
                <h3 className="text-xl font-semibold text-white">{user?.fullName}</h3>
              )}
              <p className="text-gray-400">{profileData.jobTitle}</p>
            </div>

            <div className="space-y-4">
              {['email', 'phone', 'location'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">{field}</label>
                  {isEditing ? (
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      value={editForm[field]}
                      onChange={(e) => setEditForm({...editForm, [field]: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      readOnly={field === 'email'} // Email from Clerk is usually not editable here
                    />
                  ) : (
                    <p className="text-gray-200">{field === 'email' ? user?.primaryEmailAddress?.emailAddress : profileData[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Social Links</h4>
              <div className="space-y-2">
                {/* Example Social Links */}
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400">LinkedIn</span>
                  <span className="text-sm text-indigo-400 font-medium">linkedin.com/in/alexj</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400">GitHub</span>
                  <span className="text-sm text-indigo-400 font-medium">github.com/alexj</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Account Security Card --- */}
      <div className="bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-700 rounded-lg gap-3">
            <div>
              <p className="font-medium text-gray-200">Password</p>
              <p className="text-sm text-gray-400">Last changed 2 weeks ago</p>
            </div>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors self-start sm:self-center">
              Change Password
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-700 rounded-lg gap-3">
            <div>
              <p className="font-medium text-gray-200">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Enhanced security for your account</p>
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