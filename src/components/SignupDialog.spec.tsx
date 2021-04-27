import { mountWithProviders } from '../utils/testing';
import SignupDialogTrigger from './SignupDialog';

describe('SignupDialog', () => {
    it('contains the correct data only when open', () => {
        mountWithProviders(
            <SignupDialogTrigger/>,
        );
        cy.get('[data-test="register-button"]').should('not.exist');
        cy.get('[data-test="login-button"]').should('not.exist');
        cy.get('[data-test="close-button"]').should('not.exist');

        cy.findByText('pages.orgEvent.actions.signup')
            .click()
            .then(() => {
                cy.get('[data-test="register-button"]').should('be.visible');
                cy.get('[data-test="login-button"]').should('be.visible');
                cy.get('[data-test="close-button"]').should('be.visible');
            });
    });

    it('should close on clicking the close button', () => {
        mountWithProviders(
            <SignupDialogTrigger/>,
        );
        cy.findByText('pages.orgEvent.actions.signup')
            .click()
            .then(() => {
                cy.get('[data-test="close-button"]').should('be.visible')
                    .click().then(() => {
                        cy.get('[data-test="register-button"]').should('not.exist');
                    });
            });
    });
});