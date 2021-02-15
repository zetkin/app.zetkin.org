import { mount } from '@cypress/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

import RegForm from './RegForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountWithTheme = (elem) : any => mount(
    <Provider theme={ defaultTheme }>
        { elem }
    </Provider>
);

describe('RegForm', () => {

    it('contains form with inputs and button', () => {
        mountWithTheme(<RegForm/>);

        cy.get('[data-test="first-name"]').type('Kristoffer');
        cy.get('[data-test="last-name"]').type('Larberg');
        cy.get('[data-test="email-address"]').type('mail@kristofferlarberg.se');
        cy.get('[data-test="phone-number"]').type('0736767638');
        cy.get('[data-test="password"]').type('abc123');
        cy.get('[data-test="submit-button"]');
    });
});