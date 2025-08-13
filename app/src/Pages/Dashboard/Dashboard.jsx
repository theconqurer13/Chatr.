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
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Product designer passionate about creating intuitive user experiences. Coffee enthusiast and amateur photographer.',
    jobTitle: 'Senior Product Designer'
  });

  const [editForm, setEditForm] = React.useState({ ...profileData });

  const handleSave = () => {
    setProfileData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src="https://placehold.co/120x120/violet/white?text=AJ"
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-violet-100"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="text-xl font-semibold text-gray-900 text-center border-b-2 border-violet-300 focus:border-violet-600 outline-none px-2 py-1 w-48 "
                />
              ) : (
                <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
              )}
              <p className="text-gray-600">{profileData.jobTitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-gray-900 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Social Links</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">LinkedIn</span>
                  <span className="text-sm text-violet-600">linkedin.com/in/alexj</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">GitHub</span>
                  <span className="text-sm text-violet-600">github.com/alexj</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Dribbble</span>
                  <span className="text-sm text-violet-600">dribbble.com/alexj</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Last changed 2 weeks ago</p>
            </div>
            <button className="text-violet-600 hover:text-violet-700 text-sm font-medium">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Enhanced security for your account</p>
            </div>
            <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Enabled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;