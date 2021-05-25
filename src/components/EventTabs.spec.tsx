import EventTabs from './EventTabs';
import { mountWithProviders } from '../utils/testing';
import {
    ZetkinEvent,
    ZetkinEventResponse,
} from '../types/zetkin';

describe('EventTabs', () => {
    let dummyEventResponses : ZetkinEventResponse[];
    let dummyEvents : ZetkinEvent[];
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
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
    });

    it('contains tabs for time filtering on today and whis week', () => {
        const multipleDummyEvents = [
            { ...dummyEvents[0] },
            { ...dummyEvents[0] },
            { ...dummyEvents[0] },
        ];

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);

        const later = new Date();
        later.setDate(later.getDate()+8);

        multipleDummyEvents[0].start_time = (new Date()).toISOString();
        multipleDummyEvents[1].start_time = tomorrow.toISOString();
        multipleDummyEvents[2].start_time = later.toISOString();

        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ multipleDummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
            />,
        );

        cy.contains('misc.eventTabs.tabs.today');
        cy.contains('misc.eventTabs.tabs.tomorrow');
        cy.contains('misc.eventTabs.tabs.thisWeek');
        cy.contains('misc.eventTabs.tabs.later');
    });


    it('contains event previews', () => {
        dummyEvents[0].start_time = (new Date()).toISOString();

        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                events={ dummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
            />,
        );

        cy.get('a[href*="/o/1/events/"]').should('have.length', 1);
    });
});