import React from 'react';

const ChatHistory = ({ chatHistory }) => {
  // Group chat history by year and month, also sort by most recent first
  const groupedHistory = chatHistory
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp (descending)
    .reduce((acc, chat) => {
      const date = new Date(chat.timestamp);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      acc[year][month].push(chat);

      return acc;
    }, {});

  // Sort the years in descending order
  const sortedYears = Object.keys(groupedHistory).sort((a, b) => b - a);

  return (
    <div className="space-y-2">
      {sortedYears.map((year) => (
        <div key={year} className="space-y-1 pl-2">
          {/* Only display year header if it's not the current year */}
          {year !== new Date().getFullYear().toString() && (
            <div className="text-xs font-medium text-primary-300">{year}</div>
          )}

          {/* Sort months in descending order and display */}
          {Object.entries(groupedHistory[year])
            .sort((a, b) => {
              // Sort months by date, using `Date.parse` for accurate parsing
              const monthA = Date.parse(`${a[0]} 1, ${year}`);
              const monthB = Date.parse(`${b[0]} 1, ${year}`);
              return monthB - monthA;
            })
            .map(([month, chats]) => (
              <div key={month} className="space-y-2">
                {/* Month Header */}
                <div className="text-sm font-medium text-primary-200">{month}</div>

                {chats.map((chat, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 mr-2 rounded-lg hover:bg-primary-50 cursor-pointer"
                  >
                    <div className="text-sm font-light truncate overflow-hidden whitespace-nowrap pr-2">
                      {chat.title}
                    </div>
                    <div className="text-xs text-primary-500 whitespace-nowrap">
                      {(() => {
                        const date = new Date(chat.timestamp);
                        const day = date.getDate().toString().padStart(2, '0'); // "29" - ensures it's always two digits
                        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // "Aug." or "sep."
                        const hours = date.getHours().toString().padStart(2, '0'); // "12" - ensures it's always two digits
                        const minutes = date.getMinutes().toString().padStart(2, '0'); // "45" - ensures it's always two digits

                        return `${month} ${day}. ${hours}:${minutes}`; // Constructs the final string: "29. Aug. 12:45"
                      })()}
                    </div>


                  </div>
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
