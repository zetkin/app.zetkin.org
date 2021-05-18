import EventTabs from './EventTabs';
import { mountWithProviders } from '../utils/testing';
import {
    ZetkinEvent,
    ZetkinEventResponse,
} from '../types/zetkin';

describe('EventTabs', () => {
    let dummyEvents : ZetkinEvent[];
    let dummyEventResponses : ZetkinEventResponse[];
    let dummyBookedEvents : ZetkinEvent[];

    before(()=> {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data.data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data.data;
            });
    });

    it('only shows a placeholder if there are no upcoming events', () => {
        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                later={ [] }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                today={ [] }
                tomorrow={ [] }
                week={ [] }
            />,
        );

        cy.contains('pages.my.placeholder');
    });

    it('contains different tabs for time filtering', () => {
        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                later={ dummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                today={ dummyEvents }
                tomorrow={ dummyEvents }
                week={ dummyEvents }
            />,
        );

        cy.contains('pages.my.tabs.today');
        cy.contains('pages.my.tabs.tomorrow');
        cy.contains('pages.my.tabs.thisWeek');
        cy.contains('pages.my.tabs.later');
    });

    it('contains event previews', () => {
        mountWithProviders(
            <EventTabs
                bookedEvents={ dummyBookedEvents }
                eventResponses={ dummyEventResponses }
                later={ dummyEvents }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                today={ dummyEvents }
                tomorrow={ dummyEvents }
                week={ dummyEvents }
            />,
        );

        cy.get('a[href*="/o/1/events/"]').should('have.length', 1);
    });
});