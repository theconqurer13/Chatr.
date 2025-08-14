import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Features from './Features';
import Footer from './Footer';
import { useRef } from 'react';

const Hero = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
     const navigate = useNavigate();
    const {openSignIn} = useClerk();
    const {user,isSignedIn} = useUser();
    const featureRef = useRef(null);
    const scrollToSection = (ref)=>{
        ref.current?.scrollIntoView({behavior: 'smooth'});
        
    }

     const handleClick = async () => {
        if (isSignedIn) {
        navigate("/profile");
        } else {
         openSignIn({ afterSignInUrl: "/profile" });
        }
    };

    return (
        <>
            {/* Styles for marquee animation and custom font */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                
                * {
                    font-family: 'Poppins', sans-serif;
                }
                
                `}
            </style>

            <section className="flex flex-col items-center  text-white pb-16 text-sm ">
                <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridPatternBg.svg" alt="hero-bg" className="absolute bottom-0 left-0 w-full pointer-events-none" />
                <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
                    <h1 className='text-2xl font-medium cursor-pointer' onClick={() => navigate('/')}>chatr.</h1>
                    <div
                        className={`max-md:absolute max-md:top-0 max-md:z-10 max-md:left-0 max-md:h-full max-md:bg-black/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 font-medium max-md:transition-all max-md:duration-300 max-md:overflow-hidden ${isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'}`}
                    >
                        <a href="#"  className="hover:text-gray-300">Home</a>
                        <a href="#" onClick={()=> scrollToSection(featureRef)} className="hover:text-gray-300">Features</a>
                        <a href="#" className="hover:text-gray-300">Pricing</a>

                        {user ? (<UserButton/>) : (<button className=" md:hidden  bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition" onClick={openSignIn}>
                            Sign up
                        </button>)}
                        
                        <button onClick={() => setIsMenuOpen(false)} className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md aspect-square font-medium transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                            
                    {/* {user ? ((<UserButton/>)) : (<button className="hidden md:block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition" onClick={openSignIn} >
                        Sign up
                    </button>) } */}
                    

                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md aspect-square font-medium transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
                        </svg>
                    </button>
                </nav>

                <div className="flex flex-wrap items-center justify-center p-1.5 mt-15 rounded-full border border-indigo-900 text-xs">
                    <div className="flex items-center">
                        <img className="size-7 rounded-full border-3 border-white" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-2" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-4" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop" alt="userImage3" />
                    </div>
                    <p className="-translate-x-2">Connect instantly with people worldwide </p>
                </div>

                <h1 className="text-4xl md:text-6xl text-center font-semibold max-w-4xl mt-5 bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text">
                    Chat. Connect. Collaborate.    
                </h1>
                <p className="text-slate-100 md:text-base max-md:px-2 text-center max-w-xl mt-3">
                    A simple, secure, and lightning-fast way to bring your team together — no matter where they are
                </p>

                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 mt-20 rounded-full transition " onClick={()=>{
                    if(isSignedIn){
                        handleClick();
                    }else{
                        openSignIn()
                    }
                }}>
                  {isSignedIn ? <span>Start Chatting</span> : <span>Get Started for Free</span>}
                    
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.166 10h11.667m0 0L9.999 4.167M15.833 10l-5.834 5.834" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <section ref={featureRef}>
                    <Features />
                </section>
               
            </section>
        </>
    );
}

export default Hero