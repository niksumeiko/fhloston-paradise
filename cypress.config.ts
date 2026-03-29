import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        specPattern: [
            'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
            'cypress/fhloston-paradise/**/*.cy.{js,jsx,ts,tsx}',
        ],
    },
});
