import { mount } from '@cypress/react';

import EventList from './EventList';

describe('EventList', () => {
    const dummyEvents = [
        {
            campaign: {
                title: 'Dummy campaign'
            },
            end_time: '1111 11 11, 11:11',
            id: 1,
            location: {
                title: 'Dummy location'
            },
            start_time: '0000 00 00, 00:00',
            title: 'Dummy event'
        }
    ];

    const dummyOrg = {
        id: 1,
        title: 'Dummy org'
    };

    it('contains data for each event', () => {
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);
        cy.get('[data-test="event-list"]>[data-test="event"]').each((item) => {
            cy
                .wrap(item)
                .get('[data-test="event-title"]').should('be.visible')
                .get('[data-test="org-title"]').should('be.visible')
                .get('[data-test="campaign-title"]').should('be.visible')
                .get('[data-test="start-time"]').should('be.visible')
                .get('[data-test="end-time"]').should('be.visible')
                .get('[data-test="location-title"]').should('be.visible');
        });
    });

    it('has a sign-up button', () => {
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);
        cy.get('[data-test="sign-up-button"]').should('be.visible');
    });
});