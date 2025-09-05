import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, SendHorizontal } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useSocket } from '../../App';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { token, axios, user } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  // socket listener
  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', user._id);

    const handleReceiveMessage = (message) => {
      if (message.senderId === user._id) return;

      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === message._id);
        if (isDuplicate) return prev;
        return [...prev, message];
      });
    };

    const handleUserOnline = (userId) => {
      setFriends((prev) =>
        prev.map((f) =>
          f._id === userId ? { ...f, online: true } : f
        )
      );
    };

    const handleUserOffline = (userId) => {
      setFriends((prev) =>
        prev.map((f) =>
          f._id === userId ? { ...f, online: false } : f
        )
      );
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [socket, user._id]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        // Initialize friends with proper online status and unread count
        const friendsWithStatus = response.data.friendsData.map(friend => ({
          ...friend,
          online: friend.online || false, // Ensure online property exists
          unreadMessageCount: friend.unreadMessageCount || 0
        }));
        setFriends(friendsWithStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateChat = async (friendId) => {
    try {
      const friend = friends.find((f) => f._id === friendId);
      const response = await axios.post(
        '/api/chat/create-chat',
        { friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setActiveConversation(response.data.data);
        setSelectedFriend(friend);
        setChatId(response.data.data._id);
        if (socket) socket.emit('join-room', response.data.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation?._id) return;
      try {
        const response = await axios.get(
          `/api/message/get-all-messages/${activeConversation._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          // Normalize senderId for consistent alignment
          const normalized = response.data.data.map((msg) => ({
            ...msg,
            senderId: msg.senderId || msg.sender?._id || msg.sender,
          }));
          setMessages(normalized);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation?._id || !socket) return;

    const chatMembers =
      activeConversation.members || [user._id, selectedFriend._id];

    const localMessage = {
      _id: Date.now().toString(),
      senderId: user._id,
      sender: user._id,
      chatId,
      text: newMessage,
      members: chatMembers,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessage]);
    socket.emit('send-message', localMessage);

    try {
      const response = await axios.post(
        '/api/message/send-message',
        {
          senderId: user._id,
          chatId,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setNewMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter and sort friends
  const filteredAndSortedFriends = friends
    .filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (b.unreadMessageCount !== a.unreadMessageCount) {
        return (b.unreadMessageCount || 0) - (a.unreadMessageCount || 0);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg h-full flex overflow-hidden">
      {/* --- Conversations List --- */}
      <div
        className={`${
          activeConversation ? 'hidden' : 'flex'
        } md:flex flex-col w-full md:w-80 lg:w-96 bg-gray-800 border-r border-gray-700 transition-all duration-300`}
      >
        <div className="p-2 sm:p-2 border-b border-gray-700">
          <h3 className="font-semibold text-white text-lg mb-2">Conversations</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredAndSortedFriends?.map((conv) => (
            <div
              key={conv._id}
              className={`p-4 cursor-pointer border-b border-gray-700 last:border-b-0 
                ${
                  activeConversation?._id === conv._id
                    ? 'bg-indigo-600/30'
                    : 'hover:bg-gray-700/50'
                }`}
              onClick={() => handleCreateChat(conv._id)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      activeConversation?._id === conv._id
                        ? 'text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    {conv.name}
                  </span>
                  {conv.online && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                {conv.unreadMessageCount > 0 && (
                  <div className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {conv.unreadMessageCount}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 truncate pr-4">
                  {conv.message}
                </p>
                {conv.unread && (
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Chat Area --- */}
      {activeConversation && (
        <div className="flex flex-col h-full w-full bg-gray-900">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <button
                onClick={() => setActiveConversation(null)}
                className="md:hidden mr-2 p-1 text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {selectedFriend?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-medium">
                    {selectedFriend?.name || 'User'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {selectedFriend?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white p-1">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 webkit-scrollbar-hidden">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId === user._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-lg px-3 py-2 text-sm ${
                    message.senderId === user._id
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-2 sm:p-4 border-t border-gray-700 bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white rounded-full px-1 md:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;
