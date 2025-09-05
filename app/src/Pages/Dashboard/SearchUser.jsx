import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from "lucide-react";
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import debounce from 'lodash.debounce';

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [Users, setUsers] = useState([]);
  const { axios, token, navigate, user } = useAppContext(); 
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const fetchUsers = async () => {
    if (!searchTerm.trim()) return; 
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/user/search-user',
        { parameter: searchTerm.trim() },
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      if (response.data.success) {
        let usersData = [];
        if (Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else if (response.data.data) {
          usersData = [response.data.data];
        }

        const filteredUsers = usersData
          .filter((searchUser) => searchUser._id !== user._id)
          .map((u) => ({
            ...u,
            isFriend: user.friends?.includes(u._id) || false, 
          }));

        setUsers(filteredUsers);

        if (filteredUsers.length === 0) {
          toast.info('No users found matching your search');
        }
      } else {
        toast.error(response.data.message || 'Failed to search users');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handelConnect = async (e, userId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/user/${userId}/sendFriendRequest`,
        {},
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, requestSent: true } : u
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Connect error:', error);
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(() => {
    fetchUsers();
  }, 500);

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedFetch();
    } else {
      setUsers([]); 
    }
    inputRef.current?.focus();
    return () => debouncedFetch.cancel();
  }, [searchTerm]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-gray-900  rounded-2xl shadow-lg border border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              autoFocus
              className="w-full sm:p-2 pl-12 pr-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
          <button
            onClick={fetchUsers}
            disabled={!searchTerm.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>

      {/* User Results */}
      {searchTerm.trim() && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Users.map((usr) => (
            <div
              key={usr._id}
              className="bg-gray-900 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200 hover:bg-gray-800 flex flex-col h-full justify-between"
            >
              {/* Top Section */}
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={usr.imageUrl || '/default-avatar.png'} 
                    alt={usr.name}
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-indigo-500"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg">{usr.name}</h3>
                    <p className="text-indigo-400 font-medium">{usr.jobTitle || 'No title'}</p>
                    <p className="text-gray-500 text-sm mt-1">{usr.location || 'No location'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-6">
                  {usr.bio || 'No bio available'}
                </p>
              </div>

              {/* Bottom Section (Button) */}
              <div className="mt-auto">
                <button
                  className={`cursor-pointer w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2
                  ${
                    usr.isFriend
                      ? 'opacity-50 cursor-not-allowed'
                      : usr.requestSent
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={
                    !(usr.isFriend || usr.requestSent)
                      ? (e) => handelConnect(e, usr._id)
                      : undefined
                  }
                  disabled={usr.isFriend || usr.requestSent}
                >
                  <Plus size={14} />
                  {usr.isFriend
                    ? 'Already Friend'
                    : usr.requestSent
                    ? 'Request Sent'
                    : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results State */}
      {searchTerm.trim() && Users.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <Search size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
