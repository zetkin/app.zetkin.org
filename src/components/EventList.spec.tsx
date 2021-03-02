import { mount } from '@cypress/react';

import EventList from './EventList';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

describe('EventList', () => {
    let dummyOrg : ZetkinOrganization;
    let dummyEvents : ZetkinEvent[];

    beforeEach(()=> {
        cy.fixture('dummyOrg.json')
            .then((data : ZetkinOrganization) => {
                dummyOrg = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
    });

    it('contains data for each event', () => {
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);

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
        dummyEvents[0].title = undefined;
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);

        cy.get('[data-test="event"]')
            .should('contain', dummyEvents[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);

        cy.get('[data-test="sign-up-button"]').should('be.visible');
    });

    it('shows a placeholder when the list is empty', () => {
        dummyEvents = [];
        mount(<EventList events={ dummyEvents } org={ dummyOrg }/>);

        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });

    it('shows a placeholder when the list is undefined', () => {
        mount(<EventList events={ undefined } org={ dummyOrg }/>);

        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });
});