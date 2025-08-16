import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Dummy data for demonstration


const PendingRequests = () => {
  const requestsData = [
  {id:1, name: 'Jennifer Parker', role: 'UX Researcher', company: 'TechCorp', avatar: 'JP' },
  {id:2, name: 'Robert Kim', role: 'Frontend Developer', company: 'Innovate Labs', avatar: 'RK' },
  {id:3, name: 'Lisa Chen', role: 'Product Manager', company: 'StartupXYZ', avatar: 'LC' },
  {id:4, name: 'Marcus Johnson', role: 'Data Scientist', company: 'Analytics Pro', avatar: 'MJ' },
  {id:5, name: 'Sophia Williams', role: 'Marketing Director', company: 'Growth Inc.', avatar: 'SW' },
  {id:6, name: 'Daniel Brown', role: 'Full Stack Developer', company: 'CodeCraft', avatar: 'DB' }
];
  const navigate = useNavigate();
  const handelUserClick = (userId) =>{
    navigate(`/profile/pending-requests/${userId}`)
  }

  return (
    <div className="space-y-8">
      {/* Responsive grid for request cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {requestsData.map((request) => (
          <div 
            key={request.id} 
            onClick={()=>handelUserClick(request.id)}
            className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://placehold.co/50x50/4F46E5/FFFFFF?text=${request.avatar}`}
                alt={request.name}
                className="w-12 h-12 rounded-full border-2 border-indigo-500"
              />
              <div>
                <h3 className="font-semibold text-white">{request.name}</h3>
                <p className="text-sm text-gray-400">{request.role}</p>
                <p className="text-sm text-gray-500">{request.company}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6 flex-grow">
              "We have several mutual connections and work in similar industries. Would love to connect and exchange insights."
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
      
      {/* "No more requests" section with updated theme */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
          <Bell size={24} className="text-gray-500" />
        </div>
        <p className="text-gray-500">No more pending requests</p>
      </div>
    </div>
  );
};

export default PendingRequests;
