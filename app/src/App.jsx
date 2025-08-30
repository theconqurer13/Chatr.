import React from 'react'
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

const App = () => {
  return (
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
  )
}

export default App