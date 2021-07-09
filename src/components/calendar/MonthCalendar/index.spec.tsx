import MonthCalendar from '.';
import { mountWithProviders } from '../../../utils/testing';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';

describe('MonthCalendar', () => {
    let dummyEvents: ZetkinEvent[];
    let dummyCampaigns: ZetkinCampaign[];
    const dummyStartTime = '2021-05-10T13:37:00+00:00';
    const dummyEndTime = '2021-05-10T14:37:00+00:00';
    const dummyHref = '/organize/1/campaigns/calendar';

    beforeEach(() => {
        cy.fixture('dummyEvents.json')
            .then((data: { data: ZetkinEvent[] }) => {
                dummyEvents = data.data;
                dummyEvents[0].start_time = dummyStartTime;
                dummyEvents[0].end_time = dummyEndTime;
                dummyEvents[1] = {
                    ...dummyEvents[0],
                    'end_time': '2021-05-10T17:37:00+00:00',
                    'id': 25,
                    'start_time': '2021-05-10T15:37:00+00:00',
                };
                dummyEvents[3] = {
                    ...dummyEvents[0],
                    'end_time': '2021-04-27T17:37:00+00:00',
                    'id': 24,
                    'start_time': '2021-04-27T15:37:00+00:00',
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
    });

    it('shows a grid with 5 rows and 7 columns', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 3, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="calendar-wrapper"]').should('have.css', 'display', 'grid');
        cy.get('[data-testid="calendar-wrapper"]').children().should('have.length', 35);

        cy.get('[data-testid="griditem-3"]').contains('01');
        cy.get('[data-testid="griditem-32"]').contains('30');

        cy.get('[data-testid="griditem-0"]').then(el => {
            const topLeft = el[0].getBoundingClientRect().left;
            cy.get('[data-testid="griditem-6"]').then(el => {
                const topRight = el[0].getBoundingClientRect().left;
                cy.get('[data-testid="griditem-28"]').then(el => {
                    const bottomLeft = el[0].getBoundingClientRect().left;
                    cy.get('[data-testid="griditem-34"]').then(el => {
                        const bottomRight = el[0].getBoundingClientRect().left;
                        expect(topLeft).to.eq(bottomLeft);
                        expect(topRight).to.eq(bottomRight);
                    });
                });
            });
        });
    });

    it('shows a grid with 4 rows when the month is exactly 4 weeks starting on Monday', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 1, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="calendar-wrapper"]').should('have.css', 'display', 'grid');
        cy.get('[data-testid="calendar-wrapper"]').children().should('have.length', 28);

        cy.get('[data-testid="griditem-0"]').contains('01');
        cy.get('[data-testid="griditem-27"]').contains('28');

        cy.get('[data-testid="griditem-0"]').then(el => {
            const topLeft = el[0].getBoundingClientRect().left;
            cy.get('[data-testid="griditem-6"]').then(el => {
                const topRight = el[0].getBoundingClientRect().left;
                cy.get('[data-testid="griditem-21"]').then(el => {
                    const bottomLeft = el[0].getBoundingClientRect().left;
                    cy.get('[data-testid="griditem-27"]').then(el => {
                        const bottomRight = el[0].getBoundingClientRect().left;
                        expect(topLeft).to.eq(bottomLeft);
                        expect(topRight).to.eq(bottomRight);
                    });
                });
            });
        });
    });

    it('shows a grid with 6 rows when the month takes up more than 5 rows', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="calendar-wrapper"]').should('have.css', 'display', 'grid');
        cy.get('[data-testid="calendar-wrapper"]').children().should('have.length', 42);

        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-35"]').contains('31');

        cy.get('[data-testid="griditem-0"]').then(el => {
            const topLeft = el[0].getBoundingClientRect().left;
            cy.get('[data-testid="griditem-6"]').then(el => {
                const topRight = el[0].getBoundingClientRect().left;
                cy.get('[data-testid="griditem-35"]').then(el => {
                    const bottomLeft = el[0].getBoundingClientRect().left;
                    cy.get('[data-testid="griditem-41"]').then(el => {
                        const bottomRight = el[0].getBoundingClientRect().left;
                        expect(topLeft).to.eq(bottomLeft);
                        expect(topRight).to.eq(bottomRight);
                    });
                });
            });
        });
    });

    it('displays the correct date on each grid square', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-35"]').contains('31');
    });

    it('displays the correct events on the corresponding date', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="griditem-1"]').contains('id 24');
        cy.get('[data-testid="griditem-14"]').contains('id 26');
        cy.get('[data-testid="griditem-14"]').contains('id 25');
    });

    it('shows out of range dates with another colour', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );

        cy.get('[data-testid="griditem-4"]')
            .invoke('css', 'background-color').then(color => {
                const beforeRangeBackgroundColor = color;
                cy.get('[data-testid="griditem-36"]')
                    .invoke('css', 'background-color').then(color => {
                        const afterRangeBackgroundColor = color;
                        cy.get('[data-testid="griditem-20"]')
                            .invoke('css', 'background-color').then(color => {
                                const inRangeBackgroundColor = color;
                                expect(inRangeBackgroundColor).to.not.eq(beforeRangeBackgroundColor);
                                expect(afterRangeBackgroundColor).to.eq(beforeRangeBackgroundColor);
                            });
                    });
            });
    });

    it('works with a leap year february', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2020, 1, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-33"]').contains('29');
    });

    it('works across year boundaries', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2020, 11, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="griditem-1"]').contains('01');
        cy.get('[data-testid="griditem-31"]').contains('31');
    });

    it('displays events in chronological order within a day', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="event-26"]').then(el => {
            const firstEventYPos = el[0].getBoundingClientRect().top;
            cy.get('[data-testid="event-25"]').then(el => {
                const secondEventYPos = el[0].getBoundingClientRect().top;
                expect(firstEventYPos).to.be.lessThan(secondEventYPos);
            });
        });
    });

    it('shows back and forward widget buttons', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="back-button"]').should('be.visible');
        cy.get('[data-testid="fwd-button"]').should('be.visible');
    });

    it('shows the current displayed month in the widget', () => {
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );
        cy.get('[data-testid="selected-month"]').contains('May');
        cy.get('[data-testid="selected-month"]').contains('2021');
    });

    it('sets the focus date a month ago when back is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ spyOnFocusDate } orgId="1"  />,
        );

        cy.findByText('misc.calendar.prev')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 3, 10);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0]).to.be.an.instanceof(Date);
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });

    it('sets the focus date a month forward when next is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ spyOnFocusDate } orgId="1"  />,
        );

        cy.findByText('misc.calendar.next')
            .click({ force: true })
            .then(() => {
                const date = new Date(2021, 5, 10);
                expect(spyOnFocusDate).to.be.calledOnce;
                expect(spyOnFocusDate.args[0][0]).to.be.an.instanceof(Date);
                expect(spyOnFocusDate.args[0][0].toString()).to.eq(date.toString());
            });
    });

    it('shows different colors for different campaigns', () => {
        dummyEvents[4] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-27T17:37:00+00:00',
            'id': 27,
            'start_time': '2021-04-27T15:37:00+00:00',
        };
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"  />,
        );

        cy.get('[data-testid="event-26"]')
            .invoke('css', 'background-color').then(color => {
                const firstEventBgColor = color;
                cy.get('[data-testid="event-27"]')
                    .invoke('css', 'background-color').then(color => {
                        const secondEventBgColor = color;
                        cy.get('[data-testid="event-24"]')
                            .invoke('css', 'background-color').then(color => {
                                const thirdEventBgColor = color;
                                expect(firstEventBgColor).to.not.eq(secondEventBgColor);
                                expect(firstEventBgColor).to.eq(thirdEventBgColor);
                            });
                    });
            });
    });

    it('shows a uniquely coloured sidebar for each campaign', () => {
        dummyEvents[4] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-27T17:37:00+00:00',
            'id': 27,
            'start_time': '2021-04-27T15:37:00+00:00',
        };
        dummyEvents[5] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 30,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"/>,
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

    it('does not overflow the calendar grid when there are too many events', () => {
        cy.viewport(800, 500);
        dummyEvents[4] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 27,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        dummyEvents[5] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 30,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        dummyEvents[6] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 31,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        dummyEvents[7] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 32,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"/>,
        );

        cy.get('[data-testid="griditem-3"]').should('be.visible');
        cy.get('[data-testid="day-3-events"]').should('be.visible');

        cy.get('[data-testid="griditem-3"]')
            .invoke('height').then(height => {
                const boxHeight = height;
                cy.get('[data-testid="day-3-events"]')
                    .invoke('height').then(height => {
                        const ulHeight = height;
                        expect(boxHeight).to.be.greaterThan(ulHeight as number);
                    });
            });
    });

    it('shows a tooltip when hovering over the weekly bar with campaign name', () => {
        dummyEvents[4] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-27T17:37:00+00:00',
            'id': 27,
            'start_time': '2021-04-27T15:37:00+00:00',
        };
        dummyEvents[5] = {
            ...dummyEvents[0],
            'campaign': { 'id': 942,'title': 'test-campaign' },
            'end_time': '2021-04-29T17:37:00+00:00',
            'id': 30,
            'start_time': '2021-04-29T15:37:00+00:00',
        };
        mountWithProviders(
            <MonthCalendar baseHref={ dummyHref } campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null } orgId="1"/>,
        );

        cy.get('[data-testid="calendar-bar-941"]').should('be.visible');

        cy.get('[data-testid="calendar-bar-941"]').trigger('mouseover');
        cy.findByText('Dummy campaign').should('be.visible');
    });
});
