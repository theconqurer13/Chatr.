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
  X,
  ArrowLeft
} from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('pending'); // 'none', 'pending', 'connected'

  const mockUsers = [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Senior UX Designer', company: 'TechCorp', avatar: 'https://placehold.co/120x120/violet/white?text=SC', location: 'San Francisco, CA', skills: ['UI/UX', 'Figma', 'User Research'], bio: 'Passionate UX designer with 8 years of experience creating intuitive digital experiences. Advocate for user-centered design and accessibility.', phone: '+1 (555) 234-5678', socialLinks: { linkedin: 'linkedin.com/in/sarahchen', github: 'github.com/sarahchen', dribbble: 'dribbble.com/sarahchen' } },
    { id: 2, name: 'Michael Torres', email: 'michael.torres@example.com', role: 'Frontend Developer', company: 'Innovate Labs', avatar: 'https://placehold.co/120x120/violet/white?text=MT', location: 'Austin, TX', skills: ['React', 'TypeScript', 'Next.js'], bio: 'Full-stack developer specializing in modern JavaScript frameworks. Building scalable applications with clean, maintainable code.', phone: '+1 (555) 345-6789', socialLinks: { linkedin: 'linkedin.com/in/michaeltorres', github: 'github.com/michaeltorres', twitter: 'twitter.com/michaeldev' } },
    { id: 3, name: 'Emma Wilson', email: 'emma.wilson@example.com', role: 'Product Manager', company: 'StartupXYZ', avatar: 'https://placehold.co/120x120/violet/white?text=EW', location: 'Seattle, WA', skills: ['Agile', 'Roadmapping', 'User Stories'], bio: 'Product leader focused on creating innovative solutions that solve real user problems. Experienced in scaling startups from 0 to 1.', phone: '+1 (555) 456-7890', socialLinks: { linkedin: 'linkedin.com/in/emmawilson', website: 'emmawilson.com' } },
    { id: 4, name: 'David Kim', email: 'david.kim@example.com', role: 'Data Scientist', company: 'Analytics Pro', avatar: 'https://placehold.co/120x120/violet/white?text=DK', location: 'Boston, MA', skills: ['Python', 'Machine Learning', 'SQL'], bio: 'Data scientist with expertise in machine learning and statistical modeling. Transforming complex data into actionable insights.', phone: '+1 (555) 567-8901', socialLinks: { linkedin: 'linkedin.com/in/davidkim', github: 'github.com/davidkim', kaggle: 'kaggle.com/davidkim' } },
    { id: 5, name: 'Lisa Park', email: 'lisa.park@example.com', role: 'Marketing Director', company: 'Growth Inc.', avatar: 'https://placehold.co/120x120/violet/white?text=LP', location: 'New York, NY', skills: ['Digital Marketing', 'SEO', 'Content Strategy'], bio: 'Growth-focused marketing professional with a track record of scaling brands through data-driven campaigns and creative storytelling.', phone: '+1 (555) 678-9012', socialLinks: { linkedin: 'linkedin.com/in/lisapark', twitter: 'twitter.com/lisamarketing' } },
    { id: 6, name: 'James Rodriguez', email: 'james.rodriguez@example.com', role: 'Full Stack Developer', company: 'CodeCraft', avatar: 'https://placehold.co/120x120/violet/white?text=JR', location: 'Denver, CO', skills: ['Node.js', 'React', 'MongoDB'], bio: 'Versatile developer with full-stack expertise. Passionate about building robust, scalable applications with modern technologies.', phone: '+1 (555) 789-0123', socialLinks: { linkedin: 'linkedin.com/in/jamesrodriguez', github: 'github.com/jamesrodriguez', portfolio: 'jamesrodriguez.dev' } }
  ];

  const user = mockUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/profile/search-user')}
          className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Back to Search
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
          onClick={() => navigate('/profile/search-user')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Search
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-violet-100"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-violet-600 font-medium text-lg">{user.role}</p>
                <p className="text-gray-600">{user.company}</p>
              </div>
              
              <button
                onClick={handleConnectionAction}
                className={`mt-4 sm:mt-0 px-6 py-3 rounded-lg font-medium transition-colors ${
                  connectionStatus === 'none'
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : connectionStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                }`}
              >
                {connectionStatus === 'none' && 'Connect'}
                {connectionStatus === 'pending' && 'Request Sent'}
                {connectionStatus === 'connected' && 'Connected'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">About</label>
                  <p className="text-gray-900 leading-relaxed">{user.bio}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(user.socialLinks).map(([platform, url]) => (
            <div key={platform} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  {platform === 'linkedin' && <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                  {platform === 'github' && <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>}
                  {platform === 'dribbble' && <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm8.01 3.082c1.167 1.08 2.15 2.33 2.92 3.698C21.85 8.5 22.438 10.195 22.688 12c-.25.195-18.422 11.203-18.672 11.344-.437-.703-.844-1.437-1.218-2.203C4.218 18.656 5.625 12.812 6 12c.375-.812.75-1.594 1.125-2.344.375-.75.75-1.469 1.125-2.156.375-.688.75-1.344 1.125-1.969.375-.625.75-1.219 1.125-1.78 1.125-1.688 2.344-3.188 3.656-4.5 1.313-1.313 2.719-2.438 4.219-3.375zm-1.75 5.53c-.906.844-1.78 1.75-2.625 2.719-.844.969-1.656 1.969-2.438 3-.406.53-.813 1.062-1.219 1.594-.406.53-.78 1.062-1.125 1.594-.344.53-.656 1.062-.938 1.594-.28.53-.53 1.03-.75 1.5-.22-.47-.47-.97-.75-1.5-.28-.53-.59-1.06-.938-1.594-.344-.53-.72-1.062-1.125-1.594-.406-.53-.812-1.062-1.219-1.594-.78-1.031-1.594-2.031-2.438-3-.844-.969-1.719-1.875-2.625-2.719 1.5 1.031 2.906 2.25 4.219 3.656 1.312 1.406 2.5 2.938 3.562 4.594.28.469.562.938.844 1.406.28.469.562.938.875 1.406.313.469.625.938.969 1.406.344.469.688.938 1.062 1.406.375.469.75.938 1.156 1.406.406-.47.781-.938 1.125-1.406.344-.469.656-.938.938-1.406.28-.469.531-.938.75-1.406.219-.469.406-.938.562-1.406.156-.469.281-.938.375-1.406.094-.469.156-.938.188-1.406.03-.469.03-1.03.03-1.688 1.312-1.406 2.5-2.938 3.562-4.594 1.313-1.406 2.719-2.625 4.219-3.656z"/></svg>}
                  {platform === 'twitter' && <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>}
                  {platform === 'website' && <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                  {platform === 'kaggle' && <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.625 8.25h-3.375v3.375h-3.375v3.375H8.25v-3.375H4.875v-3.375h3.375V8.25h3.375V4.875h3.375v3.375h3.375v3.375zm-5.625 8.25h-3.375v-3.375h3.375v3.375zm0-5.625h-3.375v-3.375h3.375v3.375z"/></svg>}
                  {platform === 'portfolio' && <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">{platform}</span>
              </div>
              <a 
                href={`https://${url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile