import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { FaDesktop } from 'react-icons/fa';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <FaDesktop className="mx-auto text-6xl text-white mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Desktop Only</h1>
          <p className="text-gray-400 leading-relaxed">
            This file management system is optimized for desktop use.
            Please access this application from a desktop or laptop computer for the best experience.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Minimum screen width: 1024px
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
