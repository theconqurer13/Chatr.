import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';


const HeroSection = () => {
  return(
    <>
        <Hero/>
        
    </>
  )
};

export default HeroSection;