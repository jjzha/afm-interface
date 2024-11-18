import React from 'react';
import clsx from 'clsx';

const SidePanel = ({ isVisible, onClose, children }) => {
  return (
    <>
      {/* Background Overlay - controlled within the content container instead */}
      {isVisible && (
        <div 
          className="absolute inset-0 bg-bg-300 bg-opacity-70 z-40 transition-opacity duration-300" 
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div
        className={clsx(
          'absolute top-0 right-0 w-80 h-full bg-white z-50 shadow-lg transition-transform duration-300',
          isVisible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-4"
        >
          X
        </button>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
