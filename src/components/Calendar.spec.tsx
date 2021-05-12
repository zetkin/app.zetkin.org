import Calendar from './Calendar';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../types/zetkin';

describe('Calendar', () => {
    let dummyDate = new Date('May 12, 2021');
    let dummyEvents: ZetkinEvent[];
    const dummyStartTime = '2021-05-10T13:37:00+00:00';
    const dummyEndTime = '2021-05-10T14:37:00+00:00';

    beforeEach(() => {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
                dummyEvents[0].start_time = dummyStartTime;
                dummyEvents[0].end_time = dummyEndTime;
            });
    });

    it('shows seven days of the current week starting on Monday', () => {
        mountWithProviders(
            <Calendar events={ dummyEvents } focusDate={ new Date(dummyDate) } />,
        );
        cy.get('h3').first().contains('misc.calendar.weeks.mon');
        cy.get('[data-testid="misc.calendar.weeks.mon"]').contains(10);
        cy.get('[data-testid="misc.calendar.weeks.tue"]').contains(11);
        cy.get('[data-testid="misc.calendar.weeks.wed"]').contains(12);
        cy.get('[data-testid="misc.calendar.weeks.thu"]').contains(13);
        cy.get('[data-testid="misc.calendar.weeks.fri"]').contains(14);
        cy.get('[data-testid="misc.calendar.weeks.sat"]').contains(15);
        cy.get('[data-testid="misc.calendar.weeks.sun"]').contains(16);
    });

    it('shows events that occur on the specified date', () => {
        mountWithProviders(
            <Calendar events={ dummyEvents } focusDate={ new Date(dummyDate) } />,
        );
        cy.get('[data-testid="misc.calendar.weeks.mon-events"]').should('be.visible');
    });

    it('displays year and month boundaries correctly', () => {
        dummyDate = new Date('December 31, 2020');
        dummyEvents[0].start_time = '2020-12-31T13:37:00+00:00';
        dummyEvents[0].end_time = '2020-12-31T14:37:00+00:00';

        mountWithProviders(
            <Calendar events={ dummyEvents } focusDate={ new Date(dummyDate) } />,
        );

        cy.get('[data-testid="misc.calendar.weeks.mon"]').contains(28);
        cy.get('[data-testid="misc.calendar.weeks.tue"]').contains(29);
        cy.get('[data-testid="misc.calendar.weeks.wed"]').contains(30);
        cy.get('[data-testid="misc.calendar.weeks.thu"]').contains(31);
        cy.get('[data-testid="misc.calendar.weeks.fri"]').contains(1);
        cy.get('[data-testid="misc.calendar.weeks.sat"]').contains(2);
        cy.get('[data-testid="misc.calendar.weeks.sun"]').contains(3);

        cy.get('[data-testid="misc.calendar.weeks.thu-events"]').should('be.visible');
    });
});
