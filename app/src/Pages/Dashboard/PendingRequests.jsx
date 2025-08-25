import React, { useState,useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
const PendingRequests = () => {
  const {axios,requestStatus,setRequestStatus,getToken,user} = useAppContext();
  const {id} = useParams();
  const [requests,setRequests] = useState([]);
  const [loading,setLoading] = useState(false);
  const fetchRequest = async ()=>{
    try {
      setLoading(true);
      const {data} = await axios.get('/api/pending/',{
        headers:{
          Authorization:`Bearer ${await getToken()}`
        }
      });
      if(data.success){
        setRequests(data.pendingRequestsData);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    fetchRequest();
    // const interval = setInterval(() => {
    //   fetchRequest();
    // }, 5000); // har 5 sec me check karega
  
    // return () => clearInterval(interval);
  },[]);

  
  const navigate = useNavigate();
  const handelUserClick = (userId) =>{
    navigate(`/profile/pending-requests/${userId}`)
  }
  if(loading){
    return <Loader/>
  }
  return (
    <div className="space-y-8">
      { requests?.length > 0 ? (
        // Responsive grid for request cards
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div 
              key={request.id} 
              onClick={()=>handelUserClick(request._id)}
              className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={request.image || '../../assets/userIcon.png'}
                  alt={request.name}
                  className="w-12 h-12 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <h3 className="font-semibold text-white">{request.name}</h3>
                  <p className="text-sm text-gray-400">{request.jobTitle || 'No title'}</p>
                  <p className="text-sm text-gray-500">{request.location || 'No location'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-6 flex-grow">
                {request.bio || 'No bio' }
              </p>
              <div className="flex gap-3 mt-auto">
                <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Accept
                </button>
                <button className="flex-1 border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // "No more requests" section with updated theme
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <Bell size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-500">No more pending requests</p>
        </div>
      )}
    </div> 
  );
};

export default PendingRequests;
