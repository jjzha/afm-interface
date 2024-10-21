import React, { useRef, useState, useEffect } from 'react';
import CommonTextArea from '../components/CommonTextArea';
import IconButton from '../components/IconButton';
import MessageBubble from '../components/MessageBubble'; 
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ResponseMessage from '../components/ResponsMesssage';

const ChatPage = () => {
    const inputRef = useRef(null);  // Reference to textarea
    const [chatPrompt, setChatPrompt] = useState('');  // Manages input value
    const [isFocused, setIsFocused] = useState(false);  // Manages focus state
    const [messages, setMessages] = useState([]);  // Store submitted messages
    const [response, setResponse] = useState('');  // Store the streamed response
    const [loading, setLoading] = useState(false);  // Manages loading state
    const controllerRef = useRef(null);  // Ref for aborting fetch requests

        // Handle keydown (submit on Enter, add new line with Shift+Enter)
        const handleKeyDown = (e) => {
            setIsFocused(true);
    
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmitData();  // Submit on Enter
            }
        };



    // Handle change in input
    const onChangeInput = (e) => {
        setChatPrompt(e.target.value);
    };

    // Automatically focus the textarea when the component mounts
    useEffect(() => {
        inputRef?.current?.focus();
    }, []);

    // Handle submission
    const onSubmitData = async () => {
        if (chatPrompt.trim()) {
            // Add the user's message to the list
            const userMessage = { text: chatPrompt, isSender: true };
            setMessages([...messages, userMessage]);
            setChatPrompt('');  // Clear input after sending

            // Simulate API request to backend LLM
            setLoading(true);
            setResponse('');

            // Abort any existing requests
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            const controller = new AbortController();
            controllerRef.current = controller;

            try {
                const res = await fetch("/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: [...messages, userMessage],
                        model: "meta-llama/Llama-3.1-8B-Instruct",
                        stream: true,
                        max_tokens: 300,
                        temperature: 0.7,
                    }),
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`Server responded with ${res.status}`);

                const reader = res.body.getReader();
                const decoder = new TextDecoder("utf-8");

                let assistantMessageContent = "";

                // Read the response stream
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            const dataStr = line.replace(/^data: /, '');
                            if (dataStr === '[DONE]') break;

                            try {
                                const data = JSON.parse(dataStr);
                                const delta = data.choices[0].delta;
                                if (delta && delta.content) {
                                    assistantMessageContent += delta.content;
                                    setResponse(prev => prev + delta.content);  // Update the response
                                }
                            } catch (err) {
                                console.error('Error parsing chunk:', err);
                            }
                        }
                    }
                }

                // After streaming is complete, store the assistant's message
                const assistantMessage = { text: assistantMessageContent, isSender: false };
                setMessages(prev => [...prev, assistantMessage]);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error("Error fetching LLM response:", err);
                    setResponse(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
                controllerRef.current = null;
            }
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

            {/* Message display area */}
            <div className="w-full flex flex-col items-start space-y-4 mb-4 p-4 bg-gray-100 rounded-lg max-h-[400px] overflow-y-auto">
                {messages.map((message, index) => (
                    <MessageBubble key={index} message={message.text} isSender={message.isSender} />
                ))}

                {/* Display the assistant's response as it streams */}
                {loading && <ResponseMessage response={response} loading={loading} />}
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
