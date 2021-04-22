import EventDetails from './EventDetails';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinEventResponse } from '../types/zetkin';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

describe('EventDetails', () => {
    let dummyOrg : ZetkinOrganization;
    let dummyEvent : ZetkinEvent;
    let dummyEventResponse : ZetkinEventResponse | undefined;

    beforeEach(()=> {
        cy.fixture('dummyOrg.json')
            .then((data : ZetkinOrganization) => {
                dummyOrg = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvent = data.data[0];
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponse = data.data[0];
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );
        cy.get('[data-test="event-title"]').should('be.visible');
        cy.get('[data-test="org-title"]').should('be.visible');
        cy.get('[data-test="campaign-title"]').should('be.visible');
        cy.get('[data-test="event-dates"]').should('be.visible');
        cy.get('[data-test="event-times"]').should('be.visible');
        cy.get('[data-test="location"]').should('be.visible');
        cy.get('[data-test="info-text"]').should('be.visible');
    });

    it('does not show event info if none is provided', () => {
        dummyEvent.info_text = '';
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );
        cy.get('[data-test="info-text"]').should('not.be.visible');
    });

    it('contains an activity title instead of missing event title', () => {
        dummyEvent.title = undefined;
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );
        cy.get('[data-test="event-title"]')
            .should('contain', dummyEvent.activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a link back to the organisation page', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );
        cy.get('[data-test="org-title"]')
            .should('have.attr', 'href', `/o/${dummyOrg.id}`);
    });

    it('contains a link back to the campaign page', () => {
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );
        cy.get('[data-test="campaign-title"]')
            .should('have.attr', 'href', `/o/${dummyOrg.id}/campaigns/${dummyEvent.campaign.id}`);
    });

    it('contains a sign-up button for the event', () => {
        const spyOnSignup = cy.spy();
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ spyOnSignup }
                onUndoSignup={ () => null }
                org={ dummyOrg }
                response={ undefined }
            />,
        );

        cy.findByText('pages.orgEvent.actions.signup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnceWith(dummyEvent.id, dummyOrg.id);
            });
    });

    it('contains a cancel sign-up button for the event if there is no response', () => {
        const spyOnUndoSignup = cy.spy();
        
        mountWithProviders(
            <EventDetails
                event={ dummyEvent }
                onSignup={ () => null }
                onUndoSignup={ spyOnUndoSignup }
                org={ dummyOrg }
                response={ dummyEventResponse }
            />,
        );

        cy.findByText('pages.orgEvent.actions.undoSignup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnUndoSignup).to.be.calledOnceWith(dummyEvent.id, dummyOrg.id);
            });
    });
});