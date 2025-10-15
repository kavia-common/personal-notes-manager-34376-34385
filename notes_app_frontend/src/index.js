import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import App from './App';
import { NotesProvider } from './state/notesStore';
import { ToastProvider } from './components/common/Toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <NotesProvider>
        <App />
      </NotesProvider>
    </ToastProvider>
  </React.StrictMode>
);
