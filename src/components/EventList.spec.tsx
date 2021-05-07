import EventList from './EventList';
import { mountWithProviders } from '../utils/testing';
import { UserContext } from '../hooks';
import {
    ZetkinEvent,
    ZetkinEventResponse,
} from '../types/zetkin';

describe('EventList', () => {
    let dummyEvents : ZetkinEvent[];
    let dummyEventResponses : ZetkinEventResponse[];
    let dummyBookedEvents : ZetkinEvent[];
    const dummyUser = {
        first_name: 'Firstname',
        id: 100,
        last_name: 'Lastname',
        username: 'Username',
    };

    before(()=> {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data.data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data.data;
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <EventList
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null }
                onUndoSignup={ () => null }
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
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );

        cy.get('[data-testid="event"]')
            .should('contain', dummyEvents[0].activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event if user is logged in', () => {
        const spyOnSignup = cy.spy();
        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <EventList
                    bookedEvents={ undefined }
                    events={ dummyEvents }
                    onSignup={ spyOnSignup }
                    onUndoSignup={ () => null }
                />
            </UserContext.Provider>,
        );

        cy.findByText('misc.eventList.signup')
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });

    it('contains an account signup button when user is not logged in', () => {
        mountWithProviders(
            <UserContext.Provider value={ null }>
                <EventList
                    bookedEvents={ undefined }
                    eventResponses={ dummyEventResponses }
                    events={ dummyEvents }
                    onSignup={ () => null }
                    onUndoSignup={ () => null }
                />
            </UserContext.Provider>,
        );
        cy.get('[data-test="dialog-trigger-button"]').should('exist');
        cy.get('[data-test="signup-button"]').should('not.exist');
    });


    it('contains a button for more info on each event', () => {
        mountWithProviders(
            <EventList
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
            />,
        );

        cy.contains('misc.eventList.moreInfo');
    });

    it('shows a placeholder when the list is empty', () => {
        mountWithProviders(
            <EventList
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ [] }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
            />,
        );

        cy.contains('misc.eventList.placeholder');
    });

    it('shows a placeholder when the list is undefined', () => {
        mountWithProviders(
            <EventList
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ undefined }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
            />,
        );

        cy.contains('misc.eventList.placeholder');
    });

    it('contains a booked event', () => {
        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <EventList
                    bookedEvents={ dummyBookedEvents }
                    eventResponses={ dummyEventResponses }
                    events={ dummyEvents }
                    onSignup={ () => null  }
                    onUndoSignup={ () => null  }
                />
            </UserContext.Provider>,
        );

        cy.contains('misc.eventList.booked');
    });
});