import React from 'react';

const LoadDots = () => {
  return (
    <div className="flex items-center justify-center px-2 py-1 min-w-screen">
      <div className="flex space-x-2">
        {/* Each dot has the same animation but with different inline animation delays */}
        <div className="w-1 h-1 bg-primary-300 rounded-full animate-pulse-wave" style={{ animationDelay: '0s' }}></div>
        <div className="w-1 h-1 bg-primary-300 rounded-full animate-pulse-wave" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-1 h-1 bg-primary-300 rounded-full animate-pulse-wave" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
};

export default LoadDots;
