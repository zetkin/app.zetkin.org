import '../../../utils/polyfills';
import { mountWithProviders } from '../../../utils/testing';
import WeekCalendar from '.';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from '../../../types/zetkin';

describe('WeekCalendar', () => {
    let dummyCampaigns: ZetkinCampaign[];
    let dummyDate : Date;
    let dummyEvents: ZetkinEvent[];
    let dummyTasks: ZetkinTask[];
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
        cy.fixture('dummyCampaigns.json')
            .then((data: { data: ZetkinCampaign[] }) => {
                dummyCampaigns = data.data;
                dummyCampaigns[0] = {
                    ...dummyCampaigns[0],
                    'id': 941,
                };
                dummyCampaigns[1] = {
                    ...dummyCampaigns[0],
                    'color': '#ff0000',
                    'id': 942,
                };
            });
        cy.fixture('dummyTasks.json')
            .then((data: { data: ZetkinTask[] }) => {
                dummyTasks = data.data;
            });
    });

    it('shows seven days of the current week starting on Monday', () => {
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
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
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
        );
        cy.get('[data-testid="day-0-events"]').within(() => {
            cy.get('[data-testid="event-25"]').should('be.visible');
            cy.get('[data-testid="event-26"]').should('be.visible');
        });
    });

    it('displays year and month boundaries correctly', () => {
        dummyDate = new Date('December 28, 2020');
        dummyEvents[0].start_time = '2020-12-31T13:37:00+00:00';
        dummyEvents[0].end_time = '2020-12-31T14:37:00+00:00';

        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
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
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
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
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
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
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks } />,
        );
        cy.get('[data-testid="day-0-events"]').within(() => {
            cy.get('[data-testid="event-25"]').should('be.visible');
            cy.get('[data-testid="event-26"]').should('be.visible');
        });
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
                <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
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
                <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
            </div>,
        );
        cy.get('[data-testid="calendar-wrapper"]').then(el => {
            const scrollPos = el[0].scrollTop;
            expect(scrollPos).to.eq(0);
        });
    });

    xit('shows the correct calendar week in the widget', () => {
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
        );
        cy.get('[data-testid="selected-date"]').contains('19');
    });

    xit('sets the focus date a week ago when back is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.findByText('misc.calendar.prev')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 4, 5);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0]).to.be.an.instanceof(Date);
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });

    xit('sets the focus date a week forward when next is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ dummyDate } orgId="1" tasks={ dummyTasks } />,
        );

        cy.findByText('misc.calendar.next')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 4, 19);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0]).to.be.an.instanceof(Date);
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });

    it('shows different colors for different campaigns', () => {
        dummyEvents[2] = {
            ...dummyEvents[0],
            'campaign': { ...dummyEvents[0].campaign, 'id': 942 },
            'end_time': '2021-05-11T17:37:00+00:00',
            'id': 29,
            'start_time': '2021-05-11T15:37:00+00:00',
        };
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }  />,
        );

        cy.get('[data-testid="event-26"]')
            .invoke('css', 'background-color').then(color => {
                const firstEventBgColor = color;
                cy.get('[data-testid="event-29"]')
                    .invoke('css', 'background-color').then(color => {
                        const secondEventBgColor = color;
                        cy.get('[data-testid="event-25"]')
                            .invoke('css', 'background-color').then(color => {
                                const thirdEventBgColor = color;
                                expect(firstEventBgColor).to.not.eq(secondEventBgColor);
                                expect(firstEventBgColor).to.eq(thirdEventBgColor);
                            });
                    });
            });
    });

    it('shows a uniquely coloured sidebar for each campaign', () => {
        dummyEvents[2] = {
            ...dummyEvents[0],
            'campaign': { ...dummyEvents[0].campaign, 'id': 942 },
            'end_time': '2021-05-11T17:37:00+00:00',
            'id': 29,
            'start_time': '2021-05-11T15:37:00+00:00',
        };
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.get('[data-testid="calendar-bar-941"]').should('be.visible');
        cy.get('[data-testid="calendar-bar-942"]').should('be.visible');

        cy.get('[data-testid="calendar-bar-941"]')
            .invoke('css', 'background-color').then(color => {
                const firstBarBgColor = color;
                cy.get('[data-testid="calendar-bar-942"]')
                    .invoke('css', 'background-color').then(color => {
                        const secondBarBgColor = color;
                        expect(firstBarBgColor).to.not.eq(secondBarBgColor);
                    });
            });
    });

    it('shows a tooltip when hovering over the weekly bar with campaign name', () => {
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.get('[data-testid="calendar-bar-941"]').should('be.visible');

        cy.get('[data-testid="calendar-bar-941"]').trigger('mouseover');
        cy.findByText('Dummy campaign').should('be.visible');
    });

    it('shows start time and event title and location', () => {
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.get('[data-testid="event-25"]').within(() => {
            cy.get('[data-testid="start-time-25"]').should('be.visible');
            cy.get('[data-testid="title-25"]').should('be.visible');
            cy.get('[data-testid="location-25"]').should('be.visible');
        });
    });

    it('does not show location when the event is too short', () => {
        dummyEvents[1] = {
            ...dummyEvents[0],
            'end_time': '2021-05-10T15:57:00+00:00',
            'id': 25,
            'start_time': '2021-05-10T15:37:00+00:00',
        };
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.get('[data-testid="event-25"]').within(() => {
            cy.get('[data-testid="start-time-25"]').should('be.visible');
            cy.get('[data-testid="title-25"]').should('be.visible');
            cy.get('[data-testid="location-25"]').should('not.exist');
        });
    });

    it('handles multi-day events', () => {
        dummyEvents[1] = {
            ...dummyEvents[0],
            'end_time': '2021-05-11T14:00:00+00:00',
            'id': 25,
            'start_time': '2021-05-10T15:37:00+00:00',
        };
        mountWithProviders(
            <WeekCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } orgId="1" tasks={ dummyTasks }/>,
        );

        cy.get('[data-testid="day-0-events"]').within(() => {
            cy.get('[data-testid="event-25"]').should('be.visible');
        });

        cy.get('[data-testid="day-1-events"]').within(() => {
            cy.get('[data-testid="event-25"]').should('be.visible');
        });
    });
});
