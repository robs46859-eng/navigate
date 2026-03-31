import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against libraries attempting to overwrite window.fetch
if (typeof window !== 'undefined' && !window.fetch) {
  // If fetch is missing, we let it be polyfilled, but if it exists, 
  // we prevent re-assignment by making it non-configurable if possible.
} else if (typeof window !== 'undefined' && window.fetch) {
  try {
    Object.defineProperty(window, 'fetch', {
      configurable: false,
      writable: false,
      value: window.fetch
    });
  } catch (e) {
    // Some browsers or environments might not allow this, ignore errors.
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
