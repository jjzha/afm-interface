import React from 'react';
import clsx from 'clsx';

const ResponseMessage = ({ response, loading }) => {
  return (
    <div
      className={clsx(
        'max-w-xs md:max-w-md lg:max-w-lg p-3 my-2 ',
        'text-black self-start'  // Styles for the assistant's bubble
      )}
    >
      <p className="text-sm">{response || (loading && "Assistant is typing...")}</p>
    </div>
  );
};

export default ResponseMessage;
