import { mount } from '@cypress/react';

import OrgHeader from './OrgHeader';

describe('OrgHeader', () => {
    const dummyOrg = {
        id: 1,
        title: 'My org',
    };

    it('contains org title', () => {
        mount(<OrgHeader org={ dummyOrg }/>);
        cy.contains(dummyOrg.title);
    });
});
