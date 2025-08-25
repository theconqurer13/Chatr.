
import React from 'react'


import { Routes,Route } from 'react-router-dom'

import HeroSection from './Pages/HeroSection'
import Layout from './Pages/Dashboard/Layout'
import Dashboard from './Pages/Dashboard/Dashboard'
import Messages from './Pages/Dashboard/Messages'
import PendingRequests from './Pages/Dashboard/PendingRequests'
import SearchUser from './Pages/Dashboard/SearchUser'
import UserProfile from './components/UserProfile'
import RequestProfile from './components/RequestProfile'
import {Toaster} from 'react-hot-toast'
import Loader from './components/Loader'
const App = () => {
  return (

    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<HeroSection/>} />
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="messages" element={<Messages />} /> 
          <Route path="pending-requests" element={<PendingRequests />} />
          <Route path="search-user" element={<SearchUser/>} /> 
          <Route path="search-user/:userId" element={<UserProfile/>} />
          <Route path="pending-requests/:userId" element={<RequestProfile/>} />
          {/* <Route path="loader" element={<Loader/>} /> */}
        </Route>

      </Routes>
    </div>
  )
}

export default App