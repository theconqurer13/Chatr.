
import React from 'react'


import { Routes,Route } from 'react-router-dom'

import HeroSection from './Pages/HeroSection'
import Layout from './Pages/Dashboard/Layout'
import Dashboard from './Pages/Dashboard/Dashboard'
import Messages from './Pages/Dashboard/Messages'
import PendingRequests from './Pages/Dashboard/PendingRequests'
const App = () => {
  return (

    <div>
      <Routes>
        <Route path="/" element={<HeroSection/>} />
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="messages" element={<Messages />} /> 
          <Route path="pending-requests" element={<PendingRequests />} /> 
        </Route>

      </Routes>
    </div>
  )
}

export default App