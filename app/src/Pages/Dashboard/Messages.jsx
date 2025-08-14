import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, SendHorizontal } from 'lucide-react';

// Dummy data for demonstration
const conversationsData = [
  { id: 1, name: 'Sarah Chen', avatar: 'https://placehold.co/40x40/6D28D9/FFFFFF?text=SC', message: 'Thanks for the feedback on the design...', time: '2m ago', unread: true, online: true },
  { id: 2, name: 'Michael Torres', avatar: 'https://placehold.co/40x40/1D4ED8/FFFFFF?text=MT', message: 'Can we schedule a meeting for...', time: '1h ago', unread: false, online: false },
  { id: 3, name: 'Emma Wilson', avatar: 'https://placehold.co/40x40/BE185D/FFFFFF?text=EW', message: 'The prototype looks great! When...', time: '3h ago', unread: true, online: true },
  { id: 4, name: 'David Kim', avatar: 'https://placehold.co/40x40/047857/FFFFFF?text=DK', message: 'I have a question about the...', time: '5h ago', unread: false, online: false },
];

const Messages = () => {
  // State to manage which conversation is active, especially for mobile view
  const [activeConversation, setActiveConversation] = useState(null);

  // Select the first conversation by default on larger screens
  React.useEffect(() => {
    if (window.innerWidth >= 768) { // md breakpoint
      setActiveConversation(conversationsData[0]);
    }
  }, []);

  return (
    // Main container with dark theme and rounded corners
    <div className="bg-gray-900 rounded-2xl shadow-lg h-full flex overflow-hidden">
      
      {/* --- Conversations List --- */}
      {/* Hidden on mobile when a conversation is active, otherwise takes full width. Fixed width on desktop. */}
      <div className={`
        ${activeConversation ? 'hidden' : 'flex'} md:flex flex-col 
        w-full md:w-80 lg:w-96 
        bg-gray-800 border-r border-gray-700 transition-all duration-300
      `}>
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold text-white text-lg">Conversations</h3>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversationsData.map((conv) => (
            <div 
              key={conv.id} 
              className={`p-4 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors duration-200
                ${activeConversation?.id === conv.id ? 'bg-indigo-600/30' : 'hover:bg-gray-700/50'}`
              }
              onClick={() => setActiveConversation(conv)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${activeConversation?.id === conv.id ? 'text-white' : 'text-gray-200'}`}>{conv.name}</span>
                <span className="text-xs text-gray-400">{conv.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 truncate pr-4">{conv.message}</p>
                {conv.unread && (
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Chat Window --- */}
      {/* Hidden on mobile unless a conversation is active. Takes remaining space on desktop. */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center gap-3">
              {/* Back button for mobile view */}
              <button 
                className="text-gray-400 hover:text-white md:hidden"
                onClick={() => setActiveConversation(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <img src={activeConversation.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="font-semibold text-white">{activeConversation.name}</h4>
                <p className={`text-sm ${activeConversation.online ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {activeConversation.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <MoreVertical size={20} />
            </button>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 overflow-y-auto space-y-6 p-6">
            <div className="max-w-md bg-gray-700 text-gray-200 rounded-2xl rounded-bl-lg px-4 py-3">
              <p className="text-sm">Thanks for the feedback on the design system! I've incorporated all your suggestions.</p>
            </div>
            <div className="max-w-md bg-indigo-600 text-white rounded-2xl rounded-br-lg ml-auto px-4 py-3">
              <p className="text-sm">Great! I'm glad you found the feedback helpful. The new components look much more consistent.</p>
            </div>
            <div className="max-w-md bg-gray-700 text-gray-200 rounded-2xl rounded-bl-lg px-4 py-3">
              <p className="text-sm">Do you have time for a quick call tomorrow to discuss the implementation timeline?</p>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-700 p-4 bg-gray-800">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0">
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Placeholder for when no conversation is selected on mobile
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
