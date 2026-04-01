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
});
