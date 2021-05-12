import Calendar from './Calendar';
import { mountWithProviders } from '../utils/testing';
import { ZetkinEvent } from '../types/zetkin';

describe('Calendar', () => {
    let dummyDate : Date;
    let dummyEvents: ZetkinEvent[];
    const dummyStartTime = '2021-05-10T13:37:00+00:00';
    const dummyEndTime = '2021-05-10T14:37:00+00:00';

    beforeEach(() => {
        dummyDate = new Date('May 12, 2021');
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
                dummyEvents[0].start_time = dummyStartTime;
                dummyEvents[0].end_time = dummyEndTime;
                dummyEvents[1] = {
                    ...dummyEvents[0],
                    'end_time': '2021-05-10T17:37:00+00:00',
                    'id': 25,
                    'start_time': '2021-05-10T15:37:00+00:00',
                };
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
        cy.get('[data-testid="misc.calendar.weeks.mon-events"]').children().should('be.visible');
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

        cy.get('[data-testid="misc.calendar.weeks.thu-events"]').children().should('be.visible');
    });

    it('shows the days events in the correct order', () => {
        mountWithProviders(
            <Calendar events={ dummyEvents } focusDate={ new Date(dummyDate) } />,
        );
        cy.get('ul').first().children().then(ul => {
            const firstEventYPos = ul[0].getBoundingClientRect().top;
            const secondEventYPos = ul[1].getBoundingClientRect().top;
            expect(firstEventYPos).to.be.lessThan(secondEventYPos);
        });
    });

    it('shows longer events with more height than shorter events', () => {
        mountWithProviders(
            <Calendar events={ dummyEvents } focusDate={ new Date(dummyDate) } />,
        );
        cy.get('ul').first().children().then(ul => {
            const firstEventHeight = ul[0].clientHeight;
            const secondEventHeight = ul[1].clientHeight;
            expect(firstEventHeight).to.be.lessThan(secondEventHeight);
        });
    });
});
