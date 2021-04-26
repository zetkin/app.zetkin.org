import { mountWithProviders } from '../utils/testing';
import MyHomeMenu from './MyHomeMenu';

describe('MyHomeMenu', () => {

    it('contains links to user pages', () => {
        mountWithProviders(<MyHomeMenu/>);

        cy.findByText('layout.my.tabs.feed');
        cy.findByText('layout.my.tabs.todo');
        cy.findByText('layout.my.tabs.orgs');
        cy.findByText('layout.my.tabs.settings');
    });
});
