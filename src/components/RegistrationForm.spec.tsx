import { IntlProvider } from 'react-intl';
import { mount } from '@cypress/react';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

import RegistrationForm from './RegistrationForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountWithTheme = (elem : any) : any => mount(
    <Provider theme={ defaultTheme }>
        { elem }
    </Provider>,
);

describe('Registration Form', () => {

    it('contains a form and input is submitted onClick', () => {
        const spyOnSubmit = cy.spy();

        const dummyInput = {
            email: 'user@domain.se',
            first_name: 'Firstname',
            last_name: 'Lastname',
            password: 'abc123',
            phone: '123123123',
        };

        const dummyIntl = {
            'forms.reg.fields.email': 'E-mail',
            'forms.reg.fields.firstName': 'First name',
            'forms.reg.fields.lastName': 'Last name',
            'forms.reg.fields.password': 'Password',
            'forms.reg.fields.phone': 'Phone number',
            'forms.reg.submitButton': 'Submit',
        };

        mountWithTheme(
            <IntlProvider locale="en" messages={ dummyIntl }>
                <RegistrationForm onValidSubmit={ spyOnSubmit } />
            </IntlProvider>,
        );

        cy.get('[data-test="first-name"]').type(dummyInput.first_name);
        cy.get('[data-test="last-name"]').type(dummyInput.last_name);
        cy.get('[data-test="email-address"]').type(dummyInput.email);
        cy.get('[data-test="phone-number"]').type(dummyInput.phone);
        cy.get('[data-test="password"]').type(dummyInput.password);
        cy.get('[data-test="submit-button"]').click().then(() => {
            expect(spyOnSubmit).to.be.calledOnce;
            expect(spyOnSubmit).to.be.calledWith(dummyInput);
        });
    });
});