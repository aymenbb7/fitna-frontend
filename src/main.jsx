import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';

const savedTheme = localStorage.getItem('fitna_theme') || 'luxury';
document.documentElement.setAttribute('data-theme', savedTheme);
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
