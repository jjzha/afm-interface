"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import './app.css';

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useContext, setUseContext] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(""); // Default student ID
  const [showAskButton, setShowAskButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const students = [
    { id: "95067", name: "Student 95067" },
    { id: "113967", name: "Student 113967" },
  ];

  const handleToggleContext = () => {
    setUseContext(!useContext);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setShowAskButton(false);
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: updatedMessages,
          max_tokens: 1000,
          temperature: 0.8,
          stream: false,
          use_context: useContext,
          student_id: selectedStudent, // Explicitly include the student ID
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
      
      setIsTyping(false);

      const chunks = assistantMessageContent.split("");
      for (let i = 0; i < chunks.length; i++) {
        currentText += chunks[i];
        await new Promise((resolve) => setTimeout(resolve, 1));

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = currentText;
          return updatedMessages;
        });
      }

      setShowAskButton(true);
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewQuestion = () => {
    setMessages([]);
    setShowAskButton(false);
    setInput("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/AAU_AAUBL.png" alt="App Icon" className="app-icon" />
        <div className="chat-container">
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              rows={3}
              disabled={loading || showAskButton}
              onKeyPress={handleKeyPress}
              className={showAskButton ? "disabled-input" : ""}
            />
            <button
              type="submit"
              disabled={loading || input.trim() === "" || showAskButton}
              className={showAskButton ? "disabled-button" : ""}
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </form>

          <div className="dropdown-container">
            <select
              id="student-select"
              value={selectedStudent}
              onChange={handleStudentChange}
              disabled={loading}
              className="dropdown-select"
            >
              <option value="" disabled>
                -- Choose a Student --
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

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
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span className="dots">Searching...</span>
              </div>
            )}

            {showAskButton && (
              <div className="new-question-container">
                <button onClick={handleNewQuestion} className="ask-new-question">
                  Ask Something Else
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
