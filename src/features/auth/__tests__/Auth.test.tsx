import App from '../../../App';
import { Auth, AuthAdapter, AuthAdapterProvider } from '../AuthProvider';

describe('Authentication', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Authenticates successfully with valid credentials', () => {
        const fakeAuthAdapter = createFakeAuthAdapter({
            token: 'fhloston-paradise-token',
            user: {
                id: 1,
                name: 'Korben Dallas',
                email: 'korben@fhloston.com',
                picture: '/images/korben.png',
            },
        });

        cy.mount(
            <AuthAdapterProvider adapter={fakeAuthAdapter}>
                <App />{' '}
            </AuthAdapterProvider>,
            '/',
        );

        cy.findByRole('heading', { name: /fhloston paradise/i }).should('be.visible');

        cy.findByRole('textbox', { name: /email/i }).type('korben@fhloston.com');
        cy.findByLabelText(/password/i).type('securepassword');
        cy.findByRole('button', { name: /login/i }).click();

        cy.url().should('equal', '/');
        cy.contains('Korben Dallas').should('be.visible');
    });

    it('Fails authentication with invalid credentials', () => {
        const fakeAuthAdapter = createFakeAuthAdapter(new Error('Invalid credentials'));

        cy.mount(
            <AuthAdapterProvider adapter={fakeAuthAdapter}>
                <App />{' '}
            </AuthAdapterProvider>,
            '/',
        );

        cy.findByRole('button', { name: /login/i }).click();

        cy.contains('Please enter a valid email');
        cy.contains('Password must be at least 6 characters');

        cy.findByRole('textbox', { name: /email/i }).type('korben@fhloston.com');
        cy.findByLabelText(/password/i).type('wrongpassword');

        cy.findByRole('button', { name: /login/i }).click();

        cy.contains('Invalid credentials').should('be.visible');

        cy.url().should('equal', '/login');
    });

    it('Redirects to login page when logged out', () => {
        // Simulate a logged-in state
        const authData: Auth = {
            token: 'fhloston-paradise-token',
            user: {
                id: 1,
                name: 'Korben Dallas',
                email: 'korben@fhloston.com',
                picture: '/images/korben.png',
            },
        };
        const dummyAuthAdapter = createFakeAuthAdapter(authData, authData);

        cy.mount(
            <AuthAdapterProvider adapter={dummyAuthAdapter}>
                <App />{' '}
            </AuthAdapterProvider>,
            '/',
        );

        cy.url().should('equal', '/');
        cy.contains('Korben Dallas').should('be.visible');

        // Click the logout button
        cy.findByRole('button', { name: /logout/i }).click();

        cy.url().should('equal', '/login');
        cy.findByRole('heading', { name: /authenticate/i }).should('be.visible');
    });
});

function createFakeAuthAdapter(
    result: Auth | Error,
    initialState: Auth | null = null,
): AuthAdapter {
    let data: Auth | null = initialState;
    return {
        async authenticate() {
            data = result instanceof Error ? null : result;
            return result;
        },
        getAuth() {
            return data;
        },
        logout() {
            data = null;
        },
    };
}
