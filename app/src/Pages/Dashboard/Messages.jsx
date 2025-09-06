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

  // 🔥 Normalizer for messages
  const normalizeMessage = (msg) => ({
    ...msg,
    senderId:
      msg.senderId ||
      (typeof msg.sender === 'string' ? msg.sender : msg.sender?._id),
    sender:
      typeof msg.sender === 'string' ? { _id: msg.sender } : msg.sender,
  });

  // socket listener
  useEffect(() => {
    if (!socket) return;

    // Join user's personal room for notifications
    socket.emit('join-room', user._id);

    const handleReceiveMessage = (message) => {
      const normalizedMsg = normalizeMessage(message);
      console.log('Received message:', normalizedMsg);

      // Only add the message if it's for the current chat
      if (normalizedMsg.chatId === chatId) {
        setMessages((prev) => {
          if (
            prev.some(
              (msg) =>
                msg._id === normalizedMsg._id ||
                (msg.senderId === normalizedMsg.senderId &&
                  msg.text === normalizedMsg.text &&
                  Math.abs(
                    new Date(msg.createdAt).getTime() -
                      new Date(normalizedMsg.createdAt).getTime()
                  ) < 1000)
            )
          ) {
            return prev;
          }
          return [...prev, normalizedMsg];
        });
      }
    };

    const handleUserOnline = (userId) => {
      setFriends((prev) =>
        prev.map((f) => (f._id === userId ? { ...f, online: true } : f))
      );
    };

    const handleUserOffline = (userId) => {
      setFriends((prev) =>
        prev.map((f) => (f._id === userId ? { ...f, online: false } : f))
      );
    };

    // Add event listeners
    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);

    // Clean up event listeners
    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [socket, user._id, chatId]);

  // Join chat room when chat changes
  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join-room', chatId);
    }
  }, [socket, chatId]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('/api/friends/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const friendsWithStatus = response.data.friendsData.map((friend) => ({
          ...friend,
          online: friend.online || false,
          unreadMessageCount: friend.unreadMessageCount || 0,
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
          const normalized = response.data.data.map(normalizeMessage);
          setMessages(normalized);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation?._id || !socket) return;

    const chatMembers =
      activeConversation.members || [user._id, selectedFriend._id];
    const tempMessageId = Date.now().toString();

    const localMessage = normalizeMessage({
      _id: tempMessageId,
      senderId: user._id,
      sender: { _id: user._id },
      chatId,
      text: newMessage,
      members: chatMembers,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Optimistic update
    setMessages((prev) => [...prev, localMessage]);
    setNewMessage('');

    try {
      socket.emit('send-message', {
        ...localMessage,
        sender: { _id: user._id, name: user.name },
      });

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
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempMessageId ? normalizeMessage(response.data.data) : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessageId));
    }
  };

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
              <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                <img
                  src={
                    selectedFriend?.imageUrl ||
                    'https://placehold.co/40x40/6D28D9/FFFFFF?text=U'
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>

              <div className="flex flex-col ml-2">
                <h4 className="font-semibold text-white text-sm">
                  {selectedFriend?.name || 'Unknown User'}
                </h4>
                <p
                  className={`text-sm ${
                    selectedFriend?.online ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {selectedFriend?.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-4 space-y-3 webkit-scrollbar-hidden">
            {messages?.map((msg) => {
              const senderId = msg.senderId;
              const isMyMessage = senderId === user?._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMyMessage ? 'justify-end' : 'justify-start'
                  } w-full`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                      isMyMessage
                        ? 'bg-indigo-600 text-white rounded-br-lg'
                        : 'bg-gray-700 text-gray-200 rounded-bl-lg'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
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
