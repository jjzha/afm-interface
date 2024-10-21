import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const IconButton = ({ icon: Icon, onClick, className, bgColor, size, iconSize, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center justify-center rounded-lg h-[44px] w-[44px]',  // General button styling
        bgColor,  // Dynamic background color
        className,  // Additional classes passed via props
        size  // Size of the button
      )}
    >
      <Icon className={clsx(iconSize)} />  {/* Render the icon with dynamic size */}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.elementType.isRequired,  // The icon component from Heroicons (e.g., `PlusIcon`)
  onClick: PropTypes.func,  // onClick handler
  className: PropTypes.string,  // Additional custom classes
  bgColor: PropTypes.string,  // Custom background color
  size: PropTypes.string,  // Custom size for the button (e.g., 'h-10 w-10')
  iconSize: PropTypes.string,  // Size for the icon itself (e.g., 'h-6 w-6')
  ariaLabel: PropTypes.string,  // Accessible label for screen readers
};

IconButton.defaultProps = {
  onClick: () => {},  // Default onClick function does nothing
  className: '',  // No additional classes by default
  bgColor: 'bg-primary-50',  // Default background color
  size: 'h-10 w-10',  // Default size of the button
  iconSize: 'h-6 w-6',  // Default icon size
  ariaLabel: 'Icon Button',  // Default accessible label
};

export default IconButton;
