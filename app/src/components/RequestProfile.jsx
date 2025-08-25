import React from 'react'
import { useState,useEffect } from 'react';
import { 
  User, 
  MessageCircle, 
  Bell, 
  LogOut,
  Search,
  Plus,
  Check,
  X,
  ArrowLeft
} from "lucide-react";
import { useAppContext } from '../context/AppContext';
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import Loader from './Loader';
const RequestProfile = () => {
  const [loading, setLoading] = useState(true); 
  const {axios,getToken} = useAppContext();
  const [user,setUser] = useState();
  const {userId} = useParams();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('pending'); // 'none', 'pending', 'connected'
  const fetchUser = async (id)=>{
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/profile/pending-request/${id}`,{
        headers:{
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if(!response.data.success){
        toast.error("user not find");
        navigate('/profile/pending-requests');
      }
      setUser(response.data.data);  
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchUser(userId);
    // const interval = setInterval(() => {
    //   fetchUser(userId);
    // }, 5000); // har 5 sec me check karega
    // return () => clearInterval(interval);
  },[]);

  if(loading){
    return <Loader/>
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
          <User size={40} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">User not found</h3>
        <p className="text-gray-500 mb-6">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/profile/pending-requests')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  const handleConnectionAction = () => {
    if (connectionStatus === 'none') {
      setConnectionStatus('pending');
    } else if (connectionStatus === 'pending') {
      setConnectionStatus('connected');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/profile/pending-requests')}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
        >
          <ArrowLeft size={18} />
          Back to Requests
        </button>
      </div>

      <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-shrink-0">
            <img
              src={user.image}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
                <p className="text-indigo-400 font-medium text-lg">{user.jobTitle || 'No title'}</p>
              </div>
              
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={handleConnectionAction}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Accept
                </button>
                <button
                  className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Decline
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="text-gray-300">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <p className="text-gray-300">{user.phoneNumber || 'No phone'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <p className="text-gray-300">{user.location || 'No location'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">About</label>
                  <p className="text-gray-300 leading-relaxed">{user.bio || 'No bio available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestProfile