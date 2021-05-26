import { mountWithProviders } from '../utils/testing';
import WeekCalendar from './WeekCalendar';
import { ZetkinEvent } from '../types/zetkin';

describe('WeekCalendar', () => {
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
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );

        cy.get('[data-testid="weekday-0"]').should('be.visible');
        cy.get('[data-testid="weekday-1"]').should('be.visible');
        cy.get('[data-testid="weekday-2"]').should('be.visible');
        cy.get('[data-testid="weekday-3"]').should('be.visible');
        cy.get('[data-testid="weekday-4"]').should('be.visible');
        cy.get('[data-testid="weekday-5"]').should('be.visible');
        cy.get('[data-testid="weekday-6"]').should('be.visible');

        cy.get('[data-testid="weekdays"]').first().contains('Mon');
        cy.get('[data-testid="date-0"]').contains(10);
        cy.get('[data-testid="date-1"]').contains(11);
        cy.get('[data-testid="date-2"]').contains(12);
        cy.get('[data-testid="date-3"]').contains(13);
        cy.get('[data-testid="date-4"]').contains(14);
        cy.get('[data-testid="date-5"]').contains(15);
        cy.get('[data-testid="date-6"]').contains(16);
    });

    it('shows events that occur on the specified date', () => {
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );
        cy.get('[data-testid="day-0-events"]').contains('event with id 25');
        cy.get('[data-testid="day-0-events"]').contains('event with id 26');
    });

    it('displays year and month boundaries correctly', () => {
        dummyDate = new Date('December 28, 2020');
        dummyEvents[0].start_time = '2020-12-31T13:37:00+00:00';
        dummyEvents[0].end_time = '2020-12-31T14:37:00+00:00';

        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );

        cy.get('[data-testid="date-0"]').contains(28);
        cy.get('[data-testid="date-1"]').contains(29);
        cy.get('[data-testid="date-2"]').contains(30);
        cy.get('[data-testid="date-3"]').contains(31);
        cy.get('[data-testid="date-4"]').contains(1);
        cy.get('[data-testid="date-5"]').contains(2);
        cy.get('[data-testid="date-6"]').contains(3);

        cy.get('[data-testid="event-26"]').should('be.visible');
    });

    it('shows the days events in the correct order', () => {
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );
        cy.get('[data-testid="event-26"]').then(el => {
            const firstEventYPos = el[0].getBoundingClientRect().top;
            cy.get('[data-testid="event-25"]').then(el => {
                const secondEventYPos = el[0].getBoundingClientRect().top;
                expect(firstEventYPos).to.be.lessThan(secondEventYPos);
            });
        });
    });

    it('shows longer events with more height than shorter events', () => {
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );
        cy.get('[data-testid="event-26"]').then(el => {
            const firstEventHeight = el[0].getBoundingClientRect().top;
            cy.get('[data-testid="event-25"]').then(el => {
                const secondEventHeight = el[0].getBoundingClientRect().top;
                expect(firstEventHeight).to.be.lessThan(secondEventHeight);
            });
        });
    });

    it('works with events on the edge of days', () => {
        dummyEvents[0].start_time = '2021-05-10T00:00:00+00:00';
        dummyEvents[0].end_time = '2021-05-10T01:00:00+00:00';
        dummyEvents[1].start_time = '2021-05-10T23:00:00+00:00';
        dummyEvents[1].end_time = '2021-05-10T23:59:00+00:00';
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null } />,
        );
        cy.get('[data-testid="day-0-events"]').contains('event with id 25');
        cy.get('[data-testid="day-0-events"]').contains('event with id 26');
    });

    it('scrolls when the viewport is small', () => {
        cy.viewport(800, 500);
        mountWithProviders(
            <div style={{
                bottom: 0,
                left: 0,
                padding: 0,
                position: 'absolute',
                right: 0,
                top: 0,
            }}>
                <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
            </div>,
        );
        cy.get('[data-testid="calendar-wrapper"]').then(el => {
            const scrollPos = el[0].scrollTop;
            expect(scrollPos).to.be.greaterThan(0);
        });
    });

    it('does not scroll when the viewport is big', () => {
        cy.viewport(800, 2000);
        mountWithProviders(
            <div style={{
                bottom: 0,
                left: 0,
                padding: 0,
                position: 'absolute',
                right: 0,
                top: 0,
            }}>
                <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
            </div>,
        );
        cy.get('[data-testid="calendar-wrapper"]').then(el => {
            const scrollPos = el[0].scrollTop;
            expect(scrollPos).to.eq(0);
        });
    });

    it('shows back and forward widget buttons', () => {
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );
        cy.get('[data-testid="back-button"]').should('be.visible');
        cy.get('[data-testid="fwd-button"]').should('be.visible');
    });

    it('shows the correct calendar start date in the widget', () => {
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ () => null }/>,
        );
        cy.get('[data-testid="selected-date"]').contains('10');
    });

    it('sets the focus date a week ago when back is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ spyOnFocusDate }/>,
        );

        cy.findByText('misc.calendar.prev')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 4, 5);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0] instanceof Date).to.be.true;
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });

    it('sets the focus date a week forward when next is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <WeekCalendar events={ dummyEvents } focusDate={ new Date(new Date(dummyDate)) } onFocusDate={ spyOnFocusDate } />,
        );

        cy.findByText('misc.calendar.next')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 4, 19);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0] instanceof Date).to.be.true;
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });
});