import React, { useRef, useState, useEffect } from 'react';
import InputBar from '../components/InputBar';
import MessageBubble from '../components/MessageBubble';
import Frame from '../layouts/Frame';
import { getRandomResponse } from '../services/mockResponses';
import { postChatCompletions } from '@services/chatService';

const ChatPage = () => {
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseContent, setResponseContent] = useState("");

    // Focus on the input field when the component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async () => {
        if (!input.trim()) return;
    
        const userMessage = { content: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setResponseContent("");  // Clear the streaming response content
    
        try {
            // Convert messages to the expected format with 'role' and 'content'
            const formattedMessages = messages.map((message) => {
                return {
                    role: message.isUser ? "user" : "assistant",
                    content: message.content,
                };
            });
    
            // Add the new user message to the formatted messages
            formattedMessages.push({ role: "user", content: userMessage.content });
    
            // Pass formatted messages to the API call
            const { assistantMessageContent } = await postChatCompletions(
                formattedMessages,
                userMessage,
                (deltaContent) => {
                    setResponseContent(prev => prev + deltaContent);
                }
            );
    
            const assistantMessage = { content: assistantMessageContent, isUser: false };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error fetching LLM response:", error);
            console.log("Falling back to mock response");
            const fallbackMessage = { content: getRandomResponse(), isUser: false };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setLoading(false);
        }
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

                    {/* Display the streaming response while it's loading */}
                    {loading && responseContent && (
                        <MessageBubble message={responseContent} isUser={false} />
                    )}

                    {/* Dummy div to ensure smooth scroll to the last message */}
                    <div ref={messagesEndRef}></div>
                </div>
            )}

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