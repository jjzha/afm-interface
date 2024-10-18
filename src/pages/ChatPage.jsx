import React, { useRef, useState, useEffect } from 'react';
import CommonTextArea from '../components/CommonTextArea';

const ChatPage = () => {
  const inputRef = useRef(null);  // Reference to textarea
  const [chatPrompt, setChatPrompt] = useState('');  // Manages input value
  const [isFocuse, setIsFocused] = useState(false);  // Manages focus state
  const [isInputError, setIsInputError] = useState(false);  // Manages error state

  // Handle change in input
  const onChangeInput = (e) => {
    setChatPrompt(e.target.value);
    setIsInputError(false);  // Clear error when input changes
  };

  // Handle keydown (submit on Enter, add new line with Shift+Enter)
  const handleKeyDown = (e) => {
    setIsFocused(true);

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitData();  // Submit on Enter
    }
  };

  // Automatically focus the textarea when the component mounts
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  // Placeholder function for form submission
  const onSubmitData = () => {
    if (!chatPrompt.trim()) {
      setIsInputError(true);  // Show error if input is empty
    } else {
      console.log("Submitted:", chatPrompt);
      setChatPrompt("");  // Clear input on successful submission
    }
  };

  return (
    <div className="w-full h-screen bg-bg-100 text-primary-500 flex flex-col items-center justify-center">
      <div className="w-1/3 text-center">
        <p className="text-lg font-semibold">How can I help?</p>
        <p className="text-sm mt-2">Start the chat by sending a message or uploading a file for me to review.</p>
      </div>

      {/* Use the CommonTextArea component */}
      <CommonTextArea
        inputRef={inputRef}
        isFocuse={isFocuse}
        isInputError={isInputError}
        onChangeInput={onChangeInput}
        handleKeyDown={handleKeyDown}
        setIsFocused={setIsFocused}
        textBoxValue={chatPrompt}
        parentClassName="w-2/3 m-2 p-2"
        textAreaClassName="ask-question-input caret-raisinblack"
        placeHolder="Type your message here..."
      />
    </div>
  );
};

export default ChatPage;
