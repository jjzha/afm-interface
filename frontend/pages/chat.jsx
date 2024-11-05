import React, { useRef, useState, useEffect } from 'react';
import InputBar from '../components/InputBar';
import MessageBubble from '../components/MessageBubble';
import { getRandomResponse } from '../services/mockResponses';
import { postChatCompletions } from '@services/chatService';
import LoadDots from '@components/LoadDots';

const ChatPage = () => {
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    
    const assistantStreamingResponseRef = useRef("");
    const [assistantStreamingResponse, setAssistantStreamingResponse] = useState("");

    const lastSubmitTime = useRef(0);

    // Focus on the input field when the component mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Scroll to the bottom when new messages are added or response content changes
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);  // Adding a slight delay to let DOM updates complete
    };

    useEffect(() => {
        if (isLoadingResponse) {
            scrollToBottom();
        }
    }, [assistantStreamingResponse, allMessages]);

    const handleSubmit = async () => {
        const now = Date.now();
        if (isLoadingResponse || !input.trim() || now - lastSubmitTime.current < 300) return; // Add debounce
        lastSubmitTime.current = now; // Update last submit time

        const userMessage = { content: input, isUser: true };
        setAllMessages(prev => [...prev, userMessage]);
        setInput("");
        assistantStreamingResponseRef.current = ""; // Clear the streaming response content ref
        setAssistantStreamingResponse("");          // Clear the response state as well

        setIsLoadingResponse(true);

        try {
            // Convert messages to the expected format with 'role' and 'content'
            const formattedMessages = allMessages.map((message) => {
                return {
                    role: message.isUser ? "user" : "assistant",
                    content: message.content,
                };
            });

            // Pass formatted messages to the API call
            await postChatCompletions(
                formattedMessages,
                userMessage,
                (deltaContent) => {
                    // Update the accumulated content in the ref
                    assistantStreamingResponseRef.current += deltaContent;

                    // Set the response state to trigger re-render less frequently
                    setAssistantStreamingResponse(assistantStreamingResponseRef.current);

                    // Scroll to the bottom to follow the streamed response
                    scrollToBottom();
                }
            );

        } catch (error) {
            console.error("Error fetching LLM response:", error);
            console.log("Falling back to mock response");
            const fallbackMessage = { content: getRandomResponse(), isUser: false };
            setAllMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsLoadingResponse(false);
            // After streaming ends, add the assistant message to the state
            if (assistantStreamingResponseRef.current) {
                const assistantFinalMessage = { content: assistantStreamingResponseRef.current, isUser: false };
                setAllMessages(prev => [...prev, assistantFinalMessage]);
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            {/* Messages Section */}
            {allMessages.length > 0 && (
                <div className="w-full flex-1 flex flex-col items-start p-4 space-y-2 bg-bg-100 overflow-y-auto relative">
                    {/* Spacer to push messages from the bottom */}
                    <div className="flex-grow"></div>

                    {/* Messages */}
                    {allMessages.map((message, index) => (
                        <MessageBubble key={index} message={message.content} isUser={message.isUser} />
                    ))}

                    {/* Display the streaming response while it's loading */}
                    {isLoadingResponse && assistantStreamingResponse && (
                        <MessageBubble message={assistantStreamingResponse} isUser={false} />
                    )}

                    {/* Display the loading dots while the response is being streamed */}
                    {isLoadingResponse && (
                        <div className="p-2">
                            <LoadDots />
                        </div>
                    )}

                    {/* Dummy div to ensure smooth scroll to the last message */}
                    <div ref={messagesEndRef}></div>
                </div>
            )}

            {/* Placeholder Text */}
            {allMessages.length === 0 && (
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
                    loading={isLoadingResponse}
                />
            </div>
        </div>
    );
};

export default ChatPage;
