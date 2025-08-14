import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const HeroSection = () => {
  return(
    <> 
        <div className='bg-gradient-to-b from-black to-[#1A0033]'>
          <Hero/>
          <Footer/>
        </div>
        
    </>
  )
};

export default HeroSection;