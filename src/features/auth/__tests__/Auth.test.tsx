import App from '../../../App';

describe('Authentication', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('successfully authorize', () => {
        cy.intercept('POST', '**/api/login**', {
            body: {
                token: 'fhloston-token',
                user: {
                    id: 1,
                    name: 'Korben Dallas',
                    email: 'korben@fhloston.com',
                    picture: '/korben.jpg',
                },
            },
        });

        cy.mount(<App />, '/');

        cy.findByLabelText('Email').type('korben@fhloston.com');
        cy.findByLabelText('Password').type('xyzxyz');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.url().should('equal', '/');
        cy.contains('Korben Dallas').should('be.visible');
    });

    it('see errors for invalid credentials', () => {
        cy.intercept('POST', '**/api/login**', {
            statusCode: 401,
            body: { message: 'Invalid credentials' },
        });

        cy.mount(<App />, '/login');

        cy.findByLabelText('Email').type('korben');
        cy.findByLabelText('Password').type('xyz');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.contains('Please enter a valid email').should('be.visible');
        cy.contains('Password must be at least 6 characters').should('be.visible');

        cy.findByLabelText('Email').clear().type('korben@fhloston.com');
        cy.findByLabelText('Password').clear().type('xyzxyz');
        cy.findByRole('button', { name: 'Login' }).click();

        cy.contains('Invalid credentials').should('be.visible');
    });
});
