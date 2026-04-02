import App from '../../../App';
import { createAuthProvider } from '../../../domain/user/AuthProvider.ts';
import { ContextProvider } from '../../../common/context';
import { AuthResponse } from '../../../domain/user/AuthAdapter.ts';

describe('Authentication', () => {
    it('successfully authorize', () => {
        let data: AuthResponse | null = null;
        const fake = {
            getAuth: () => data,
            login: () => {
                data = {
                    token: 'fhloston-token',
                    user: {
                        id: 1,
                        name: 'Korben Dallas',
                        email: 'korben@fhloston.com',
                        picture: '/korben.jpg',
                    },
                };

                return Promise.resolve(data);
            },
            logout: () => {},
        };

        cy.mount(
            <ContextProvider providers={[createAuthProvider(fake)]}>
                <App />
            </ContextProvider>,
            '/',
        );

        cy.findByLabelText('Email').type('korben@fhloston.com');
        cy.findByLabelText('Password').type('xyzxyz');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.url().should('equal', '/');
        cy.contains('Korben Dallas').should('be.visible');
    });

    it('see errors for invalid credentials', () => {
        const fake = {
            getAuth: () => null,
            login: () => {
                return Promise.reject({ message: 'Invalid credentials' });
            },
            logout: () => {},
        };

        cy.mount(
            <ContextProvider providers={[createAuthProvider(fake)]}>
                <App />
            </ContextProvider>,
            '/',
        );

        cy.findByLabelText('Email').type('korben');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.contains('Please enter a valid email').should('be.visible');

        cy.findByLabelText('Email').clear().type('korben@fhloston.com');
        cy.findByLabelText('Password').type('xyzxyz');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.contains('Invalid credentials').should('be.visible');
    });

    it('logs out from the dashboard', () => {
        let data: AuthResponse | null = {
            token: 'fhloston-token',
            user: {
                id: 2,
                name: 'Leeloo',
                email: 'leeloo@fhloston.com',
                picture: '/leeloo.jpg',
            },
        };
        const fake = {
            getAuth: () => data,
            login: () => Promise.reject(),
            logout: () => {
                data = null;
            },
        };

        cy.mount(
            <ContextProvider providers={[createAuthProvider(fake)]}>
                <App />
            </ContextProvider>,
            '/',
        );

        cy.url().should('equal', '/');
        cy.contains('Leeloo').should('be.visible');

        cy.findByRole('button', { name: 'Logout' }).click();

        cy.url().should('include', '/login');
        cy.findByRole('heading', { name: 'Authenticate' }).should('be.visible');
    });
});
