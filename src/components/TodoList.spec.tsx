import { mountWithProviders } from '../utils/testing';
import TodoList from './TodoList';
import {
    ZetkinEventResponse,
    ZetkinTodoEvent,
} from '../types/zetkin';

describe('TodoList', () => {
    let dummyTodoEvents : ZetkinTodoEvent[];
    let dummyEventResponses : ZetkinEventResponse[];

    beforeEach(()=> {
        cy.fixture('dummyTodoEvents.json')
            .then((data : {data: ZetkinTodoEvent[]}) => {
                dummyTodoEvents = data.data;
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data.data;
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                todoEvents={ dummyTodoEvents }
            />,
        );

        cy.get('[data-testid="event"]').each((item) => {
            cy.wrap(item)
                .get('[data-testid="event-title"]').should('be.visible')
                .get('[data-testid="org-title"]').should('be.visible')
                .get('[data-testid="campaign-title"]').should('be.visible')
                .get('[data-testid="start-time"]').should('be.visible')
                .get('[data-testid="end-time"]').should('be.visible')
                .get('[data-testid="location-title"]').should('be.visible');
        });
    });

    it('contains an activity title instead of missing event title', () => {
        dummyTodoEvents[0].event.title = undefined;

        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ () => null }
                onUndoSignup={ () => null }
                todoEvents={ dummyTodoEvents }
            />,
        );

        cy.get('[data-testid="event"]')
            .should('contain', dummyTodoEvents[0].event.activity.title)
            .should('not.contain', 'undefined');
    });

    it('contains a sign-up button for each event', () => {
        const spyOnSignup = cy.spy();

        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ spyOnSignup }
                onUndoSignup={ () => null }
                todoEvents={ dummyTodoEvents }
            />,
        );

        cy.findByText('misc.eventListItem.signup')
            .eq(0)
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });

    it('contains a button for more info on each event', () => {
        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                todoEvents={ dummyTodoEvents }
            />,
        );

        cy.contains('misc.eventListItem.moreInfo');
    });

    it('shows a placeholder when the list is empty', () => {
        dummyTodoEvents = [];

        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                todoEvents={ dummyTodoEvents }
            />,
        );

        cy.contains('misc.todoList.placeholder');
    });

    it('shows a placeholder when the list is undefined', () => {
        mountWithProviders(
            <TodoList
                eventResponses={ dummyEventResponses }
                onSignup={ () => null  }
                onUndoSignup={ () => null  }
                todoEvents={ undefined }
            />,
        );

        cy.contains('misc.todoList.placeholder');
    });
});