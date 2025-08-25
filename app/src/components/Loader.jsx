import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Loader */}
      <div className="relative flex justify-center items-center w-16 h-16 animate-spin">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full"></div>

        {/* Middle ring with delay */}
        <div className="absolute w-12 h-12 border-4 border-transparent border-r-indigo-500 rounded-full animate-spin" style={{ animationDelay: '0.2s' }}></div>

        {/* Inner ring with delay */}
        <div className="absolute w-8 h-8 border-4 border-transparent border-b-indigo-400 rounded-full animate-spin" style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-indigo-600 font-medium text-lg animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;