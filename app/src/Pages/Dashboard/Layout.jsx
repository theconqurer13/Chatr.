
import React, { useState } from "react";
import { 
  User, 
  MessageCircle, 
  Bell, 
  LogOut,
  Edit2,
  Check,
  X
} from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,Outlet,useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = React.useState({
    name: 'Alex Johnson',
    avatar: 'https://placehold.co/48x48/violet/white?text=AJ'
  });
  const [activeSection, setActiveSection] = useState('profile');
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/profile/messages' },
    { id: 'requests', label: 'Pending Requests', icon: Bell, path: '/profile/pending-requests' }
  ];
  
  const handleLogout = () => {
    // In a real app, you would clear authentication tokens here
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2 list-none">
         {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} >
                  <button
                    onClick={() =>{ 
                      setActiveSection(item.id);
                      navigate(item.path)}}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      activeSection === item.id
                        ? 'bg-violet-100 text-violet-800 border-r-2 border-violet-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
           </ul> 
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {menuItems.find(item => location.pathname === item.path)?.label}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent w-64"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors">
                <User size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;