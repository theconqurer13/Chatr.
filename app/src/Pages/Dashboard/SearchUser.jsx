import React from 'react'
import { useState } from 'react';
import { 
User, 
  MessageCircle, 
  Bell, 
  LogOut,
  Search,
  Plus,
  Check,
  X
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
   const navigate = useNavigate() ;
  const filters = ['Designers', 'Developers', 'Product Managers', 'Marketers', 'Data Scientists'];
  
  const mockUsers = [
    { id: 1, name: 'Sarah Chen', role: 'Senior UX Designer', company: 'TechCorp', avatar: 'SC', location: 'San Francisco, CA', skills: ['UI/UX', 'Figma', 'User Research'] },
    { id: 2, name: 'Michael Torres', role: 'Frontend Developer', company: 'Innovate Labs', avatar: 'MT', location: 'Austin, TX', skills: ['React', 'TypeScript', 'Next.js'] },
    { id: 3, name: 'Emma Wilson', role: 'Product Manager', company: 'StartupXYZ', avatar: 'EW', location: 'Seattle, WA', skills: ['Agile', 'Roadmapping', 'User Stories'] },
    { id: 4, name: 'David Kim', role: 'Data Scientist', company: 'Analytics Pro', avatar: 'DK', location: 'Boston, MA', skills: ['Python', 'Machine Learning', 'SQL'] },
    { id: 5, name: 'Lisa Park', role: 'Marketing Director', company: 'Growth Inc.', avatar: 'LP', location: 'New York, NY', skills: ['Digital Marketing', 'SEO', 'Content Strategy'] },
    { id: 6, name: 'James Rodriguez', role: 'Full Stack Developer', company: 'CodeCraft', avatar: 'JR', location: 'Denver, CO', skills: ['Node.js', 'React', 'MongoDB'] },
    { id: 7, name: 'Olivia Johnson', role: 'UI Designer', company: 'Creative Studio', avatar: 'OJ', location: 'Portland, OR', skills: ['Illustration', 'Prototyping', 'Design Systems'] },
    { id: 8, name: 'Daniel Brown', role: 'DevOps Engineer', company: 'Cloud Solutions', avatar: 'DB', location: 'Chicago, IL', skills: ['AWS', 'Docker', 'Kubernetes'] }
  ];

  const handleFilterToggle = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.some(filter => 
        user.role.toLowerCase().includes(filter.toLowerCase().replace('ers', ''))
      );
    
    return matchesSearch && matchesFilters;
  });

  const handelUserClick = (userId) =>{
    navigate(`/profile/search-user/${userId}`)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar and Filters */}
      <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, role, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
            >
              <span className="font-medium text-gray-200">Filters</span>
              <Plus
                className={`transform transition-transform ${showFilters ? 'rotate-45' : ''}`}
                size={20}
                color="#6366f1"
              />
            </button>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterToggle(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden bg-gray-800 rounded-xl p-4 space-y-2 animate-fadeIn border border-gray-700">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterToggle(filter)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilters.includes(filter)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
        </h2>
        {selectedFilters.length > 0 && (
          <button
            onClick={() => setSelectedFilters([])}
            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* User Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id}
            onClick={()=> handelUserClick(user.id)}
           className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200 hover:bg-gray-800">
             <div className="flex items-start gap-4 mb-4">
              <img
                src={`https://placehold.co/50x50/4F46E5/FFFFFF?text=${user.avatar}`}
                alt={user.name}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                <p className="text-indigo-400 font-medium">{user.role}</p>
                <p className="text-gray-400 text-sm">{user.company}</p>
                <p className="text-gray-500 text-sm mt-1">{user.location}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-900 text-indigo-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <MessageCircle size={14} />
                  Message
                </button>
                <button className="flex-1 border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Plus size={14} />
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <Search size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFilters([]);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchUser