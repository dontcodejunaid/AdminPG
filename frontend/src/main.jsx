import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// Prevent mousewheel on number inputs from altering values
if (typeof window !== 'undefined') {
  window.addEventListener('wheel', (e) => {
    if (document.activeElement && document.activeElement.type === 'number') {
      document.activeElement.blur();
    }
  }, { passive: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
