import EventDetails from './EventDetails';
import { mountWithProviders } from '../utils/testing';
import { UserContext } from '../hooks';
import { ZetkinEvent } from '../types/zetkin';

describe('EventDetails', () => {
    let dummyEvent : ZetkinEvent;
    const dummyUser = {
        first_name: 'Firstname',
        id: 100,
        last_name: 'Lastname',
        username: 'Username',
    };

    beforeEach(()=> {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvent = data.data[0];
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );
        cy.get('[data-testid="event-title"]').should('be.visible');
        cy.get('[data-testid="org-title"]').should('be.visible');
        cy.get('[data-testid="campaign-title"]').should('be.visible');
        cy.get('[data-testid="event-dates"]').should('be.visible');
        cy.get('[data-testid="event-times"]').should('be.visible');
        cy.get('[data-testid="location"]').should('be.visible');
        cy.get('[data-testid="info-text"]').should('be.visible');
    });

    it('does not show event info if none is provided', () => {
        dummyEvent.info_text = '';
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );
        cy.get('[data-testid="info-text"]').should('not.be.visible');
    });

    it('contains an activity title instead of missing event title', () => {
        dummyEvent.title = undefined;
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );
        cy.get('[data-testid="event-title"]')
            .should('contain', dummyEvent.activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a link back to the organisation page', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );
        cy.get('[data-testid="org-title"]')
            .should('have.attr', 'href', `/o/${dummyEvent.organization.id}`);
    });

    it('contains a link back to the campaign page', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
            />,
        );
        cy.get('[data-testid="campaign-title"]')
            .should('have.attr', 'href', `/o/${dummyEvent.organization.id}/campaigns/${dummyEvent.campaign.id}`);
    });

    it('contains a sign-up button for the event', () => {
        const spyOnSignup = cy.spy();
        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <EventDetails
                    event={ dummyEvent }
                    onSignup={ spyOnSignup }
                    onUndoSignup={ () => null }
                />
            </UserContext.Provider>,
        );

        cy.findByText('pages.orgEvent.actions.signup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnceWith(
                    dummyEvent.id,
                    dummyEvent.organization.id,
                );
            });
    });

    it('contains a cancel sign-up button for the event if already signed up', () => {
        const spyOnUndoSignup = cy.spy();
        dummyEvent.userResponse = true;

        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <EventDetails
                    event={ dummyEvent }
                    onSignup={ () => null }
                    onUndoSignup={ spyOnUndoSignup }
                />
            </UserContext.Provider>,
        );

        cy.findByText('pages.orgEvent.actions.undoSignup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnUndoSignup).to.be.calledOnceWith(
                    dummyEvent.id,
                    dummyEvent.organization.id,
                );
            });
    });

    it('contains a sign-up button for the event when not logged in', () => {
        mountWithProviders(
            <UserContext.Provider value={ null }>
                <EventDetails
                    event={ dummyEvent }
                    onSignup={ () => null }
                    onUndoSignup={ () => null }
                />
            </UserContext.Provider>,
        );

        cy.get('[data-test="dialog-trigger-button"]').should('exist');
        cy.get('[data-test="signup-button"]').should('not.exist');
    });
});