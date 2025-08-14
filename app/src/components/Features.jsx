import React from 'react'
import instantConversation from '../assets/Instant Conversation.jpg'
import secureImg from '../assets/SecureImg.jpg'
import shareImg from '../assets/shareImg.jpg'
const Features = () => {
  return (
    <>
    
    
    <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                
                * {
                    font-family: 'Poppins';
                }
                
                `}</style>
        
        <h1 className="text-3xl font-semibold text-center mx-auto mt-15">Powerful Features</h1>
        <p className="text-sm text-slate-400 text-center mt-2 max-w-[60vw] mx-auto">Fast messaging and instant file sharing — all secured with end-to-end encryption.Group chats, private talks, and smart search keep everything at your fingertips.Custom themes and cloud sync make sure your chats are always personal and always safe.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
            <div className="max-w-80 hover:-translate-y-0.5 transition duration-300 ">
                <img className="rounded-xl max-h-60" src={instantConversation} alt="" />
                <h3 className="text-base font-semibold mt-4">Instant Conversations</h3>
                <p className="text-sm text-slate-400 mt-1">Send and receive messages without delays. Stay connected with friends in real-time.</p>
            </div>
            <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                <img className="rounded-xl" src={shareImg} alt="" />
                <h3 className="text-base font-semibold mt-4">Seamless File Sharing</h3>
                <p className="text-sm text-slate-400 mt-1">Send images, documents, and videos with ease — securely and without size limits.</p>
            </div>
            <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                <img className="rounded-xl" src={secureImg} alt="" />
                <h3 className="text-base font-semibold  mt-4">Your Privacy, Our Priority</h3>
                <p className="text-sm text-slate-400 mt-1">Enjoy end-to-end encryption and data protection, so your conversations stay yours.</p>
            </div>
        </div>
    </>    
  )
}

export default Features