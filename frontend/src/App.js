import React, { useState, useRef } from "react";
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Store the conversation history
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref to hold the AbortController for canceling fetch requests
  const controllerRef = useRef(null);

  // Function to handle API request to the backend LLM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    // Abort any existing requests
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create a new AbortController for the new request
    const controller = new AbortController();
    controllerRef.current = controller;

    // Add the user's message to the conversation history
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    try {
      const res = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-3B-Instruct", // Replace with your actual model name
          messages: updatedMessages,
          max_tokens: 300,
          temperature: 0.7,
          n: 1,
          stream: true, // Enable streaming
        }),
        signal: controller.signal, // Attach the AbortController signal
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      // Handle streaming response
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessageContent = ""; // To accumulate the assistant's response

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and split into lines
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          // Process lines that start with 'data:'
          if (line.startsWith('data:')) {
            const dataStr = line.replace(/^data: /, '');
            if (dataStr === '[DONE]') {
              // Stream finished
              break;
            } else {
              try {
                const data = JSON.parse(dataStr);
                const delta = data.choices[0].delta;
                if (delta && delta.content) {
                  // Update the assistant's message content
                  assistantMessageContent += delta.content;

                  // Update the response with typing effect
                  setResponse(prev => prev + delta.content);
                }
              } catch (err) {
                console.error('Error parsing data chunk:', err);
              }
            }
          }
        }
      }

      // After the streaming is done, add the assistant's message to the conversation history
      const assistantMessage = { role: "assistant", content: assistantMessageContent };
      setMessages(prev => [...prev, userMessage, assistantMessage]);
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
      setInput(""); // Clear the input field
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>LLM Test v0.1</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt"
            rows={5}
            cols={50}
            disabled={loading}
          />
          <br />
          <button type="submit" disabled={loading || input.trim() === ""}>
            {loading ? "Loading..." : "Send"}
          </button>
        </form>

        <div className="conversation">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
            </div>
          ))}
          {loading && response && (
            <div className="message assistant">
              <strong>Assistant:</strong> {response}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
