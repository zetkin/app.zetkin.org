import { mount } from '@cypress/react';

import EventList from './EventList';

describe('EventList', () => {
    let dummyOrg;
    let dummyEvents;

    beforeEach(()=> {
        cy.fixture('dummyOrg.json')
            .then((data) => {
                dummyOrg = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data) => {
                dummyEvents = data;
            });
    });

    it('contains data for each event', () => {
        mount(<EventList events={ dummyEvents.data } org={ dummyOrg.data }/>);

        cy.get('[data-test="event"]').each((item) => {
            cy.wrap(item)
                .get('[data-test="event-title"]').should('be.visible')
                .get('[data-test="org-title"]').should('be.visible')
                .get('[data-test="campaign-title"]').should('be.visible')
                .get('[data-test="start-time"]').should('be.visible')
                .get('[data-test="end-time"]').should('be.visible')
                .get('[data-test="location-title"]').should('be.visible');
        });
    });

    it('contains an activity title instead of missing event title', () => {
        dummyEvents.data[0].title = undefined;
        mount(<EventList events={ dummyEvents.data } org={ dummyOrg }/>);

        cy.get('[data-test="event"]')
            .should('contain', dummyEvents.data[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        mount(<EventList events={ dummyEvents.data } org={ dummyOrg }/>);

        cy.get('[data-test="sign-up-button"]').should('be.visible');
    });
});