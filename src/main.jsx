import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

const rootEl = document.getElementById('root');

if (!rootEl) {
  document.body.innerHTML =
    '<main style="font-family:sans-serif;padding:2rem;max-width:32rem"><h1>ClaimClear AI</h1><p>The app could not start because the page root is missing. Reload the page, or contact support if this continues.</p></main>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
