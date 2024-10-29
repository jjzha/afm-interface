import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import CommonTextArea from '../components/CommonTextArea';
import IconButton from '../components/IconButton';

const InputBar = ({ inputRef, input, setInput, handleSubmit, loading }) => {
  const onEnterPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="w-full m-2 flex flex-row items-center justify-around">
        <CommonTextArea
            inputRef={inputRef}
            isFocused={input.length > 0}
            onChangeInput={(e) => setInput(e.target.value)}
            textBoxValue={input}
            handleKeyDown={onEnterPress}  // Handle Enter key
            disabled={loading}
            placeHolder="Type your message..."
        />
        <IconButton
            icon={PaperAirplaneIcon}
            onClick={handleSubmit}
            disabled={loading || input.trim() === ''}
            ariaLabel="Send message"
            className="p-2 m-2"
        />
    </div>
  );
}

export default InputBar;
