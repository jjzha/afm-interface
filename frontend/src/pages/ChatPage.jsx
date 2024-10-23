// src/pages/ChatPage.js
import React, { useRef, useState, useEffect } from 'react';
import CommonTextArea from '../components/CommonTextArea';
import IconButton from '../components/IconButton';
import MessageBubble from '../components/MessageBubble';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ResponseMessage from '../components/ResponseMesssage';
//import { postChatCompletions } from '../services/backend_api';  // Import the new API function
import {  getRandomResponse } from '../services/mockResponses';  // Import the new utility function

const ChatPage = () => {
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResponse("");
        
        const assistantMessageContent = getRandomResponse();  // Use the utility function to get a random response
        const userMessage = { role: "user", content: input };
        try {
            //const { assistantMessageContent } = await postChatCompletions(messages, userMessage);
            setMessages(prev => [...prev, userMessage, { role: "assistant", content: assistantMessageContent }]);
            setResponse(assistantMessageContent);
        } catch (error) {
            setResponse(`Error: ${error.message}`);
        } finally {
            setLoading(false);
            setInput("");  // Clear the input field after the chat interaction is complete
        }
    };

    return (
        <div className="w-full h-screen bg-bg-100 text-primary-500 flex flex-col items-center justify-center">
            {messages.length === 0 && (
                <div className="w-1/3 text-center mb-4">
                    <p className="text-lg font-semibold">How can I help?</p>
                    <p className="text-sm mt-2">Start the chat by sending a message or uploading a file for me to review.</p>
                </div>
            )}
            <div className="w-full flex flex-col items-start space-y-4 mb-4 p-4 bg-bg-100 rounded-lg max-h-[400px] overflow-y-auto">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message.content} isSender={message.role === 'user'} />
                ))}
                {loading && <ResponseMessage response={response} />}
            </div>
            <div className="w-full m-2 p-2 flex flex-row items-center justify-around">
                <CommonTextArea
                    inputRef={inputRef}
                    isFocused={input.length > 0}
                    onChangeInput={(e) => setInput(e.target.value)}
                    textBoxValue={input}
                    parentClassName="w-full m-2 p-2"
                    textAreaClassName="ask-question-input caret-raisinblack"
                    placeholder="Type your message here..."
                    disabled={loading}
                />
                <IconButton
                    icon={PaperAirplaneIcon}
                    className="p-2 m-2"
                    onClick={handleSubmit}
                    disabled={loading || input.trim() === ''}
                />
            </div>
        </div>
    );
};

export default ChatPage;
