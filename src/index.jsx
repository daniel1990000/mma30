import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Entry point: Renders the App component into the HTML root element.
// This is the starting file that bootstraps the React app.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);