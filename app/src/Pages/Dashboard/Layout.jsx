import React, { useState, useEffect } from "react";
import { 
  User, 
  MessageCircle, 
  Bell, 
  LogOut,
  Menu,
  Search
} from "lucide-react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";

const Layout = () => {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(location.pathname);

    // Update active section when location changes
    useEffect(() => {
        setActiveSection(location.pathname);
    }, [location.pathname]);

    // Redirect if not signed in
    useEffect(() => {
        if (!isSignedIn) {
            navigate("/"); // Not logged in? Back to Hero
        }
    }, [user]);
    const menuItems = [
        { id: '/profile', label: 'Profile', icon: User, path: '/profile' },
        { id: '/profile/messages', label: 'Messages', icon: MessageCircle, path: '/profile/messages' },
        { id: '/profile/pending-requests', label: 'Pending Requests', icon: Bell, path: '/profile/pending-requests' },
        { id: '/profile/search-user', label: 'Search User', icon: Search, path: '/profile/search-user' }
    ];

    return (
        // Main container with a light gray background for contrast
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* --- Sidebar (Indigo/Black Theme) --- */}
            <div className="flex flex-col bg-gray-900 text-white shadow-lg transition-all duration-300 w-20 md:w-64">
                
                {/* User Profile */}
                <div className="p-4 md:p-3 border-b border-gray-700">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <img
                            src={user?.imageUrl}
                            alt="User"
                            className="w-12 h-12 rounded-full border-2 border-indigo-500"
                        />
                        <div className="hidden md:block">
                            <p className="font-semibold text-white truncate">{user?.fullName}</p>
                            <p className="text-sm text-gray-400">Online</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 md:p-4">
                    <ul className="flex flex-col gap-2 list-none">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection.startsWith(item.id);
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            navigate(item.path);
                                            
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left justify-center md:justify-start ${
                                            isActive
                                                ? 'bg-indigo-600 text-white' // Active state
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive state
                                        }`}
                                        title={item.label}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium hidden md:inline">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-2 md:p-4 border-t border-gray-700">
                    <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 justify-center md:justify-start"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        <span className="font-medium hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>

            {/* --- Main Content (White/Light Theme) --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* --- Top Bar (Header) --- */}
              <header className="bg-gray-900 shadow-sm border-b border-gray-700 px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <h1 className="text-xl md:text-2xl font-medium text-white self-start md:self-center">
                    {menuItems.find((item) => item.path === activeSection)?.label}
                  </h1>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                      <h3 className="text-white text-lg cursor-pointer" onClick={()=>navigate('/')} >Home</h3>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </header>

              {/* --- Content Area --- */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-gray-900 to-gray-800">
                <Outlet />
              </main>
            </div>
        </div>
    );
};

export default Layout;