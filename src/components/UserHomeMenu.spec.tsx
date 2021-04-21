import { mountWithProviders } from '../utils/testing';
import UserHomeMenu from './UserHomeMenu';

describe('UserHomeMenu', () => {

    it('contains links to user pages', () => {
        mountWithProviders(<UserHomeMenu/>);

        cy.findByText('layout.userHome.tabs.feed');
        cy.findByText('layout.userHome.tabs.toDo');
        cy.findByText('layout.userHome.tabs.orgs');
        cy.findByText('layout.userHome.tabs.settings');
    });
});
