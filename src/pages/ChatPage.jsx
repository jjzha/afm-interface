import React, { useRef, useState, useEffect } from 'react';
import CommonTextArea from '../components/CommonTextArea';
import IconButton from '../components/IconButton';
import MessageBubble from '../components/MessageBubble';  // Import the MessageBubble component
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatPage = () => {
    const inputRef = useRef(null);  // Reference to textarea
    const [chatPrompt, setChatPrompt] = useState('');  // Manages input value
    const [messages, setMessages] = useState([]);  // Store submitted messages
    const [isFocused, setIsFocused] = useState(false);  // Manages focus state

    // Handle change in input
    const onChangeInput = (e) => {
        setChatPrompt(e.target.value);
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

    // Function to handle message submission
    const onSubmitData = () => {
        if (chatPrompt.trim()) {
            // Add the new message to the list of messages
            setMessages([...messages, { text: chatPrompt, isSender: true }]);
            setChatPrompt('');  // Clear input after sending
        }
    };

    return (
        <div className="w-full h-screen bg-bg-100 text-primary-500 flex flex-col items-center justify-center">
              {/* Show introductory text only when no messages are submitted */}
              {messages.length === 0 && (
                <div className="w-1/3 text-center mb-4">
                    <p className="text-lg font-semibold">How can I help?</p>
                    <p className="text-sm mt-2">Start the chat by sending a message or uploading a file for me to review.</p>
                </div>
            )}

            {/* Message display area */}
            <div className="w-full h-full flex flex-col items-start space-y-4 mb-4 p-4 max-h-[400px] overflow-y-auto">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message.text}/>
                ))}
            </div>

            {/* Input area */}
            <div className="w-full m-2 p-2 flex flex-row items-center justify-around">
                <CommonTextArea
                    inputRef={inputRef}
                    isFocused={isFocused}
                    onChangeInput={onChangeInput}
                    handleKeyDown={handleKeyDown}
                    setIsFocused={setIsFocused}
                    textBoxValue={chatPrompt}
                    parentClassName="w-full m-2 p-2"
                    textAreaClassName="ask-question-input caret-raisinblack"
                    placeHolder="Type your message here..."
                />
                <IconButton
                    icon={PaperAirplaneIcon}
                    className={'p-2 m-2'}
                    onClick={onSubmitData}  // Trigger message sending on click
                />
            </div>
        </div>
    );
};

export default ChatPage;
