import React from 'react'
import { useNavigate } from 'react-router-dom'
const Footer = () => {
    const navigate = useNavigate(); 
  return (
    <footer className="w-full  text-white mt-15">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <h1 className='text-5xl font-medium '>chatr.</h1>
                </div>
                <p className="text-center max-w-3xl text-sm font-normal leading-relaxed">
                   From the spark of an idea to a finished masterpiece, we help you create with confidence. Our AI-driven tools blend creativity with technology, so you can dream bigger, design better, and share your vision with the world.
                </p>
            </div>
            <div className="border-t border-[#532a9d]">
                <div className="max-w-7xl mx-auto px-6 py-2 text-center text-sm font-normal">
                   <span onClick={()=>navigate('/')}> chatr.</span> ©2025. All rights reserved.
                </div>
            </div>
        </footer>
  )
}

export default Footer