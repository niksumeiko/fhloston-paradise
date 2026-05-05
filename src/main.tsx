import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { httpAuthAdapter } from './adapters/httpAuthAdapter';
import App from './App';
import { AuthAdapterProvider } from './features/auth/AuthProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthAdapterProvider adapter={httpAuthAdapter}>
                <App />
            </AuthAdapterProvider>
        </BrowserRouter>
    </StrictMode>,
);
