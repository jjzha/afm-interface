import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const IconButton = ({ icon: Icon, onClick, className, bgColor, size, iconSize, ariaLabel, disabled }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center justify-center rounded-lg h-[44px] w-[44px]',
        bgColor,
        className,
        size
      )}
      disabled={disabled}
    >
      <Icon className={clsx(iconSize)} />
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  size: PropTypes.string,
  iconSize: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool
};

export default IconButton;
