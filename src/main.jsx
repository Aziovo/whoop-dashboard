import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { WhoopProvider } from './context/WhoopContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WhoopProvider>
      <App />
    </WhoopProvider>
  </React.StrictMode>
);
