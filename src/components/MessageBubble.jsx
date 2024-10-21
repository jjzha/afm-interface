import React from 'react';
import clsx from 'clsx';

const MessageBubble = ({ message }) => {
  return (
    <div
      className={clsx(
        'max-w-xs md:max-w-md lg:max-w-lg p-3 my-2 rounded-lg bg-blue-500 text-white self-end'
      )}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default MessageBubble;
