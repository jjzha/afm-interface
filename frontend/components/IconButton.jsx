import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  className = "", 
  bgColor = "bg-primary-50", 
  hoverBgColor = "hover:bg-primary-500",
  iconColor = "text-primary-500 hover:text-primary-50",
  ariaLabel, 
  disabled = false, 
  iconClassname = "",
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center justify-center rounded-lg h-11 w-11 transition duration-200',
        bgColor,
        hoverBgColor,
        className,
        {
          'cursor-not-allowed' : disabled,
        }
      )}
      disabled={disabled}
    >
      <Icon
        className={clsx(
          "size-6",  // Fixed size for the icon
          iconColor,
          iconClassname  // Allowing additional rotation or styling classes
        )}
      />
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
  iconColor: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  iconClassname: PropTypes.string,
};

export default IconButton;
