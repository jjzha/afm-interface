import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div
      className={clsx(
        'max-w-xs md:max-w-md lg:max-w-lg p-3 font-light text-black',
        {
          'self-end bg-primary-50 rounded-lg': isUser, // Aligns user messages to the right
          'self-start': !isUser // Aligns assistant messages to the left
        }
      )}
    >
      <p className="text-xs md:text-sm">{message}</p>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool
};

MessageBubble.defaultProps = {
  isUser: false
};

export default MessageBubble;
