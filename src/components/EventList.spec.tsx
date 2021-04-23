import EventList from './EventList';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../types/zetkin';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinOrganization } from '../types/zetkin';

describe('EventList', () => {
    let dummyOrg : ZetkinOrganization;
    let dummyEvents : ZetkinEvent[];
    let dummyEventResponses : ZetkinEventResponse[];

    beforeEach(()=> {
        cy.fixture('dummyOrg.json')
            .then((data : ZetkinOrganization) => {
                dummyOrg = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data.data;
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onEventResponse={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.get('[data-testid="event"]').each((item) => {
            cy.wrap(item)
                .get('[data-testid="event-title"]').should('be.visible')
                .get('[data-testid="org-title"]').should('be.visible')
                .get('[data-testid="campaign-title"]').should('be.visible')
                .get('[data-testid="start-time"]').should('be.visible')
                .get('[data-testid="end-time"]').should('be.visible')
                .get('[data-testid="location-title"]').should('be.visible');
        });
    });

    it('contains an activity title instead of missing event title', () => {
        dummyEvents[0].title = undefined;

        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onEventResponse={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.get('[data-testid="event"]')
            .should('contain', dummyEvents[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        const spyOnSubmit = cy.spy();

        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onEventResponse={ spyOnSubmit }
                org={ dummyOrg }
            />,
        );

        cy.findByText('misc.eventList.signup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnSubmit).to.be.calledOnce;
            });
    });

    it('contains a button for more info on each event', () => {
        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onEventResponse={ () => null  }
                org={ dummyOrg }
            />,
        );

        cy.contains('misc.eventList.moreInfo');
    });

    it('shows a placeholder when the list is empty', () => {
        dummyEvents = [];

        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onEventResponse={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.contains('misc.eventList.placeholder');
    });

    it('shows a placeholder when the list is undefined', () => {
        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ undefined }
                onEventResponse={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.contains('misc.eventList.placeholder');
    });
});