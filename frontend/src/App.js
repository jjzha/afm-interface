import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useContext, setUseContext] = useState(true);

  const handleToggleContext = () => {
    setUseContext(!useContext);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: updatedMessages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
          use_context: useContext,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const assistantMessageContent = data.choices[0].message.content;

      let currentText = "";
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "" }]);

      const chunks = assistantMessageContent.split("");
      for (let i = 0; i < chunks.length; i++) {
        currentText += chunks[i];
        await new Promise((resolve) => setTimeout(resolve, 1)); // 1ms delay

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = currentText;
          return updatedMessages;
        });
      }
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AAU Concierge v0.001</h1>
        <div className="chat-container">
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              rows={3}
              disabled={loading}
              onKeyPress={handleKeyPress}
            />
            <button type="submit" disabled={loading || input.trim() === ""}>
              {loading ? "Loading..." : "Send"}
            </button>
          </form>

          <div className="toggle-container">
            <label className="toggle-label">Use Moodle Database</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={useContext}
                onChange={handleToggleContext}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="conversation">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You:' : 'Assistant:'}</strong>
                <div className="message-content">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
