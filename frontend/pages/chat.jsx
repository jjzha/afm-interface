import React, { useRef, useState, useEffect } from 'react';
import InputBar from '../components/InputBar';
import MessageBubble from '../components/MessageBubble';
import Frame from '../layouts/Frame';
import { getRandomResponse } from '../services/mockResponses';

const ChatPage = () => {
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Focus on the input field when the component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = () => {
        if (!input.trim()) return;

        // Immediately add user message to the messages array
        const userMessage = { content: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput("");  // Clear the input field

        // Now simulate getting the assistant's response
        setLoading(true);
        setTimeout(() => {
            const assistantMessage = { content: getRandomResponse(), isUser: false };
            setMessages(prev => [...prev, assistantMessage]);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            {/* Messages Section */}
            {messages.length > 0 && (
            <div className="w-full flex-1 flex flex-col items-start p-4 space-y-2 bg-bg-100 overflow-y-auto relative">
                {/* Spacer to push messages from the bottom */}
                <div className="flex-grow"></div>

                {/* Messages */}
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message.content} isUser={message.isUser} />
                ))}

                {/* Dummy div to ensure smooth scroll to the last message */}
                <div ref={messagesEndRef}></div>
            </div>)}

            {/* Placeholder Text */}
            {messages.length === 0 && (
                <div className="flex-1 w-2/3 flex flex-col items-center justify-center text-center text-tertiary-500 p-4">
                    <p className="text-sm ">How can I help?</p>
                    <p className="text-sm font-light mt-4">Start the chat by sending a message 
                        or uploading a file for me to review.</p>
                </div>
            )}

            <div className='w-full px-2'>
                <InputBar 
                    inputRef={inputRef}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ChatPage;
