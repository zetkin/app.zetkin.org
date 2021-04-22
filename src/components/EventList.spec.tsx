import EventList from './EventList';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

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
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
            />,
        );

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

        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.get('[data-test="event"]')
            .should('contain', dummyEvents[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        const spyOnSignup = cy.spy();

        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ spyOnSignup }
                onUndoSignup={ () => null }
                org={ dummyOrg }
            />,
        );

        cy.findByText('misc.eventList.signup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });

    it('contains a button for more info on each event', () => {
        mountWithProviders(
            <EventList
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
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
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
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
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                org={ dummyOrg }
            />,
        );

        cy.contains('misc.eventList.placeholder');
    });
});