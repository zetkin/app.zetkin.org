import MonthCalendar from './MonthCalendar';
import { mountWithProviders } from '../utils/testing';
import { ZetkinCampaign, ZetkinEvent } from '../types/zetkin';

describe('MonthCalendar', () => {
    let dummyEvents: ZetkinEvent[];
    let dummyCampaigns: ZetkinCampaign[];
    const dummyStartTime = '2021-05-10T13:37:00+00:00';
    const dummyEndTime = '2021-05-10T14:37:00+00:00';

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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 3, 10) } onFocusDate={ () => null }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 1, 10) } onFocusDate={ () => null }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-35"]').contains('31');
    });

    it('displays the correct events on the corresponding date', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="griditem-1"]').contains('id 24');
        cy.get('[data-testid="griditem-14"]').contains('id 26');
        cy.get('[data-testid="griditem-14"]').contains('id 25');
    });

    it('shows out of range dates with another colour', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );

        cy.get('[data-testid="griditem-4"]').then(el => {
            const beforeRangeBackgroundColor = el[0].style.backgroundColor;
            cy.get('[data-testid="griditem-36"]').then(el => {
                const afterRangeBackgroundColor = el[0].style.backgroundColor;
                cy.get('[data-testid="griditem-20"]').then(el => {
                    const inRangeBackgroundColor = el[0].style.backgroundColor;
                    expect(inRangeBackgroundColor).to.not.eq(beforeRangeBackgroundColor);
                    expect(afterRangeBackgroundColor).to.eq(beforeRangeBackgroundColor);
                });
            });
        });
    });

    it('works with a leap year february', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2020, 1, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="griditem-5"]').contains('01');
        cy.get('[data-testid="griditem-33"]').contains('29');
    });

    it('works across year boundaries', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2020, 11, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="griditem-1"]').contains('01');
        cy.get('[data-testid="griditem-31"]').contains('31');
    });

    it('displays events in chronological order within a day', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="back-button"]').should('be.visible');
        cy.get('[data-testid="fwd-button"]').should('be.visible');
    });

    it('shows the current displayed month in the widget', () => {
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );
        cy.get('[data-testid="selected-month"]').contains('May');
        cy.get('[data-testid="selected-month"]').contains('2021');
    });

    it('sets the focus date a month ago when back is clicked', () => {
        const spyOnFocusDate = cy.spy();
        mountWithProviders(
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ spyOnFocusDate }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ spyOnFocusDate }  />,
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
            <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }  />,
        );

        cy.get('[data-testid="event-26"]').then(el => {
            const firstEventBgColor = el[0].style.backgroundColor;
            cy.get('[data-testid="event-27"]').then(el => {
                const secondEventBgColor = el[0].style.backgroundColor;
                cy.get('[data-testid="event-24"]').then(el => {
                    const thirdEventBgColor = el[0].style.backgroundColor;
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
            <div style={{
                bottom: 0,
                left: 0,
                padding: 0,
                position: 'absolute',
                right: 0,
                top: 0,
            }}>
                <MonthCalendar campaigns={ dummyCampaigns } events={ dummyEvents } focusDate={ new Date(2021, 4, 10) } onFocusDate={ () => null }/>,
            </div>,
        );

        cy.get('[data-testid="calendar-bar-941"]').should('be.visible');
        cy.get('[data-testid="calendar-bar-942"]').should('be.visible');

        cy.get('[data-testid="calendar-bar-941"]').then(el => {
            const firstBarBgColor = el[0].style.backgroundColor;
            cy.get('[data-testid="calendar-bar-942"]').then(el => {
                const secondBarBgColor = el[0].style.backgroundColor;
                expect(firstBarBgColor).to.not.eq(secondBarBgColor);
            });
        });
    });
});