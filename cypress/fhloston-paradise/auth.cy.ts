describe('Authentication', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });

    it('Korben Dallas can successfully login', () => {
        cy.get('input#email').type('korben@fhloston.com');
        cy.get('input#password').type('multipass');
        cy.get('button#login').click();

        cy.url().should('eq', 'http://localhost:5173/');
        cy.contains('Welcome, Korben Dallas');
    });

    it('Leeloo can successfully login', () => {
        cy.get('input#email').type('leeloo@fhloston.com');
        cy.get('input#password').type('leeloo123');
        cy.get('button#login').click();

        cy.url().should('eq', 'http://localhost:5173/');
        cy.contains('Welcome, Leeloo');
    });

    it('Ruby Rhod can successfully login', () => {
        cy.get('input#email').type('ruby@fhloston.com');
        cy.get('input#password').type('greenrocks');
        cy.get('button#login').click();

        cy.url().should('eq', 'http://localhost:5173/');
        cy.contains('Welcome, Ruby Rhod');
    });

    it('Zorg with wrong credentials cannot login', () => {
        cy.get('input#email').type('zorg@fhloston.com');
        cy.get('input#password').type('zorg123');
        cy.get('button#login').click();

        cy.url().should('eq', 'http://localhost:5173/login');
        cy.get('#login-alert').contains('Invalid email or password');
    });

    it('Login form displays invalid credential format message', () => {
        cy.get('input#email').type('wrong&mail.com');
        cy.get('input#password').type('123');
        cy.get('button#login').click();

        cy.url().should('eq', 'http://localhost:5173/login');
        cy.get('#email-alert').contains('Please enter a valid email');
        cy.get('#password-alert').contains('Password must be at least 6 characters');
    });

    it('Logout action returns to the login page', () => {
        cy.get('input#email').type('ruby@fhloston.com');
        cy.get('input#password').type('greenrocks');
        cy.get('button#login').click();
        cy.url().should('eq', 'http://localhost:5173/');

        cy.get('button#logout').click();
        cy.url().should('eq', 'http://localhost:5173/login');
    });
});
