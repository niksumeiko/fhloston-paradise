describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display the login form', () => {
        cy.get('form').should('be.visible');
        cy.get('input[id="email"]').should('be.visible');
        cy.get('input[id="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
        cy.get('button[type="submit"]').click();
        cy.get('input[id="email"]')
            .parent()
            .find('[data-cy="alert"]')
            .should('be.visible');
        cy.get('input[id="password"]')
            .parent()
            .find('[data-cy="alert"]')
            .should('be.visible');
    });

    it('should show an error for invalid credentials', () => {
        cy.get('input[id="email"]').type('invalid@example.com');
        cy.get('input[id="password"]').type('invalidpassword');
        cy.get('button[type="submit"]').click();
        cy.get('[data-cy="alert"]').should('be.visible');
    });

    it('should log in successfully with valid credentials', () => {
        cy.get('input[id="email"]').type('korben@fhloston.com');
        cy.get('input[id="password"]').type('multipass');
        cy.get('button[type="submit"]').click();
        cy.get('[data-cy="alert"]').should('not.exist');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('should log out successfully', () => {
        cy.get('input[id="email"]').type('korben@fhloston.com');
        cy.get('input[id="password"]').type('multipass');
        cy.get('button[type="submit"]').click();
        cy.get('[data-cy="alert"]').should('not.exist');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);

        cy.get('[data-cy="logout"]').click();
        cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    });

    it('should redirect to login page when accessing protected route', () => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    });
});
