/// <reference types="../../node_modules/cypress/types/cypress-npm-api" />
/// <reference types="../../node_modules/cypress/types/net-stubbing" />
/// <reference types="../../node_modules/cypress/types/cypress" />
/// <reference types="../../node_modules/cypress/types/cypress-global-vars" />
/// <reference types="../../node_modules/cypress/types/cypress-type-helpers" />
import { type ReactElement, StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import { mount, type MountReturn } from 'cypress/react';

import '../../src/index.css';
import './commands';

Cypress.Commands.overwriteQuery('url', () => {
    return () => {
        const hash = cy.getRemoteLocation('hash') ?? '';

        return hash.replace(/^#/, '');
    };
});

Cypress.Commands.add('mount', (element, path, options, rerenderKey) => {
    return cy
        .window()
        .then((w) => {
            w.location.hash = `#${path}`;

            return path;
        })
        .then(() =>
            mount(
                <StrictMode>
                    <HashRouter>{element}</HashRouter>
                </StrictMode>,
                options,
                rerenderKey,
            ),
        );
});

Cypress.Commands.add(
    'getByTestId',
    (testId: string): Cypress.Chainable<JQuery<HTMLElement>> => {
        return cy.get(`[data-test="${testId}"]`);
    },
);

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            getRemoteLocation(key: string): string | undefined;
            mount(
                element: ReactElement,
                path: string,
                options?: Partial<{ log: boolean }>,
                rerenderKey?: string,
            ): Chainable<MountReturn>;
            getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>>;
        }
    }
}
