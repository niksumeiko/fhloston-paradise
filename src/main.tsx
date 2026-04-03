import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ContextProvider } from './common/context';
import { createAuthProvider } from './domain/user/AuthProvider';
import * as authAdapter from './domain/user/AuthAdapter';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider providers={[createAuthProvider(authAdapter)]}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ContextProvider>
    </StrictMode>,
);
