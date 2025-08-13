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



const PendingRequests = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Jennifer Parker', role: 'UX Researcher', company: 'TechCorp', avatar: 'JP' },
          { name: 'Robert Kim', role: 'Frontend Developer', company: 'Innovate Labs', avatar: 'RK' },
          { name: 'Lisa Chen', role: 'Product Manager', company: 'StartupXYZ', avatar: 'LC' },
          { name: 'Marcus Johnson', role: 'Data Scientist', company: 'Analytics Pro', avatar: 'MJ' },
          { name: 'Sophia Williams', role: 'Marketing Director', company: 'Growth Inc.', avatar: 'SW' },
          { name: 'Daniel Brown', role: 'Full Stack Developer', company: 'CodeCraft', avatar: 'DB' }
        ].map((request, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={`https://placehold.co/50x50/violet/white?text=${request.avatar}`}
                alt={request.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.role}</p>
                <p className="text-sm text-gray-500">{request.company}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We have several mutual connections and work in similar industries. Would love to connect and exchange insights.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium">
                Accept
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500">No more pending requests</p>
      </div>
    </div>
  );
};

export default PendingRequests