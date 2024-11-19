import React from 'react';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="space-y-2">
      {chatHistory.map((chat, index) => (
        <div key={index} className="flex justify-between items-center p-4 rounded-lg hover:bg-primary-50 cursor-pointer">
          <div className="text-sm font-light truncate">{chat.title}</div>
          <div className="text-xs text-primary-500 whitespace-nowrap">{chat.timestamp}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
