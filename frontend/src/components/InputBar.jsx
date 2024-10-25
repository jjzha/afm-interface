// InputBar.js
import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'; // Correct the path if needed
import CommonTextArea from '../components/CommonTextArea';
import IconButton from '../components/IconButton';

const InputBar = ({ inputRef, input, setInput, handleSubmit, loading }) => {
  return (
    <div className=" inset-0 bottom-0 w-full m-2 p-2 flex flex-row items-center justify-around">
        <CommonTextArea
            inputRef={inputRef}
            isFocused={input.length > 0}
            onChangeInput={(e) => setInput(e.target.value)}
            textBoxValue={input}
            disabled={loading}
        />
        <IconButton
            icon={ PaperAirplaneIcon}
            className="p-2 m-2"
            onClick={handleSubmit}
            disabled={loading || input.trim() === ''}
        />
    </div>
  );
}

export default InputBar;
