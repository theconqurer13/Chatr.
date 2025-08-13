const Messages = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
      <div className="flex h-96">
        <div className="w-80 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Conversations</h3>
          </div>
          <div className="overflow-y-auto h-full">
            {[
              { name: 'Sarah Chen', message: 'Thanks for the feedback on the design...', time: '2m ago', unread: true },
              { name: 'Michael Torres', message: 'Can we schedule a meeting for...', time: '1h ago', unread: false },
              { name: 'Emma Wilson', message: 'The prototype looks great! When...', time: '3h ago', unread: true },
              { name: 'David Kim', message: 'I have a question about the...', time: '5h ago', unread: false },
            ].map((conv, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{conv.name}</span>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{conv.message}</p>
                  {conv.unread && (
                    <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="https://placehold.co/40x40/violet/white?text=SC" alt="Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              <div className="max-w-xs bg-violet-600 text-white rounded-2xl rounded-bl-sm px-4 py-2">
                <p className="text-sm">Thanks for the feedback on the design system! I've incorporated all your suggestions.</p>
              </div>
              <div className="max-w-xs bg-gray-100 text-gray-900 rounded-2xl rounded-br-sm ml-auto px-4 py-2">
                <p className="text-sm">Great! I'm glad you found the feedback helpful. The new components look much more consistent.</p>
              </div>
              <div className="max-w-xs bg-violet-600 text-white rounded-2xl rounded-bl-sm px-4 py-2">
                <p className="text-sm">Do you have time for a quick call tomorrow to discuss the implementation timeline?</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages