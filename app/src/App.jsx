import React, { useEffect, useState, createContext, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import HeroSection from './Pages/HeroSection'
import Layout from './Pages/Dashboard/Layout'
import Dashboard from './Pages/Dashboard/Dashboard'
import Messages from './Pages/Dashboard/Messages'
import PendingRequests from './Pages/Dashboard/PendingRequests'
import SearchUser from './Pages/Dashboard/SearchUser'
import UserProfile from './components/UserProfile'
import RequestProfile from './components/RequestProfile'
import { Toaster } from 'react-hot-toast'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import { io } from 'socket.io-client';

// Create Socket Context
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3002", {
      transports: ['websocket', 'polling'], // Fallback transports
      timeout: 20000,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={socket}>
      <div>
        <Toaster />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="pending-requests" element={<PendingRequests />} />
            <Route path="search-user" element={<SearchUser />} />
            <Route path="search-user/:userId" element={<UserProfile />} />
            <Route path="pending-requests/:userId" element={<RequestProfile />} />
          </Route>
        </Routes>
      </div>
    </SocketContext.Provider>
  )
}

export default App