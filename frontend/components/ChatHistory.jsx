import React from 'react';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="space-y-4">
      {chatHistory.map((chat, index) => (
        <div key={index} className="flex justify-between items-center p-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer">
          <div className="text-sm font-medium truncate">{chat.title}</div>
          <div className="text-xs text-gray-500">{chat.timestamp}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
