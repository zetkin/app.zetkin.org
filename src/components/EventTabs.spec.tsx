import EventTabs from './EventTabs';
import { mountWithProviders } from '../utils/testing';
import {
    ZetkinEvent,
    ZetkinEventResponse,
} from '../types/zetkin';

describe('EventTabs', () => {
    let dummyTimeRange : {
        later: ZetkinEvent[] | undefined;
        today: ZetkinEvent[] | undefined;
        tomorrow: ZetkinEvent[] | undefined;
        week: ZetkinEvent[] | undefined;
    };
    let dummyEventResponses : ZetkinEventResponse[];
    let dummyBookedEvents : ZetkinEvent[];

    before(()=> {
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data.data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data.data;
            });
    });

    beforeEach(()=> {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyTimeRange = {
                    later: data.data,
                    today: data.data,
                    tomorrow: data.data,
                    week: data.data,
                };
            });
    });

    it('contains different tabs for time filtering', () => {
        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                timeRange={ dummyTimeRange }
            />,
        );

        cy.contains('misc.eventTabs.tabs.today');
        cy.contains('misc.eventTabs.tabs.tomorrow');
        cy.contains('misc.eventTabs.tabs.thisWeek');
        cy.contains('misc.eventTabs.tabs.later');
    });

    it('contains event previews', () => {
        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                timeRange={ dummyTimeRange }
            />,
        );

        cy.get('a[href*="/o/1/events/"]').should('have.length', 1);
    });
});