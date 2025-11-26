import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App'; // Corrected import path

// Render the App component
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}