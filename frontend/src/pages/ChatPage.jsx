import React, { useRef, useState, useEffect } from 'react';
import InputBar from '../components/InputBar';
import MessageBubble from '../components/MessageBubble';
import Frame from '../layouts/Frame';
import { getRandomResponse } from '../services/mockResponses';

const ChatPage = () => {
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        if (!input.trim()) return;

        setLoading(true);
        
        const userMessage = { content: input, isUser: true };
        const assistantMessage = { content: getRandomResponse(), isUser: false };  // Simulate an assistant response

        setTimeout(() => {
            setMessages(prev => [...prev, userMessage, assistantMessage]);
            setLoading(false);
            setInput("");  // Clear the input field after the chat interaction is complete
        }, 500);
    };

    return (
       <Frame>
        <div className="w-full text-primary-500 flex flex-col items-center">
            {messages.length === 0 && (
                <div className="w-1/3 text-center mb-4">
                    <p className="text-lg font-semibold">How can I help?</p>
                    <p className="text-sm mt-2">Start the chat by sending a message or uploading a file for me to review.</p>
                </div>
            )}
            <div className="test-blue-bg">Test Background</div>
            <div className="w-full flex flex-col items-start p-4 space-y-2 bg-bg-100 rounded-lg overflow-y-auto">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message.content} isUser={message.isUser} />
                ))}
            </div>

            <InputBar 
                inputRef={inputRef}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </div>
       </Frame>
    );
};

export default ChatPage;
