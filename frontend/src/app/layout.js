// src/app/layout.js

import './globals.css'; // Import global CSS styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}

