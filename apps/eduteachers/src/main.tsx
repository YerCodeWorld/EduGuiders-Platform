import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles directly
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);