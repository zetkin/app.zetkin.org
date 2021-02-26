import { mount } from '@cypress/react';

import EventList from './EventList';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

describe('EventList', () => {
    let dummyOrg : {data: ZetkinOrganization};
    let dummyEvents : {data: ZetkinEvent[]};

    beforeEach(()=> {
        cy.fixture('dummyOrg.json')
            .then((data : {data: {id: number; title: string}}) => {
                dummyOrg = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
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
        mount(<EventList events={ dummyEvents.data } org={ dummyOrg.data }/>);

        cy.get('[data-test="event"]')
            .should('contain', dummyEvents.data[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        mount(<EventList events={ dummyEvents.data } org={ dummyOrg.data }/>);

        cy.get('[data-test="sign-up-button"]').should('be.visible');
    });
});