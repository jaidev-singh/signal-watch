// Entry point for the React app
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './app/routes';
import './styles/global.css';
import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
