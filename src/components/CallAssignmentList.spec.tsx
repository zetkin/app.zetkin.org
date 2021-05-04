import CallAssignmentList from './CallAssignmentList';
import { mountWithProviders } from '../utils/testing';
import {
    ZetkinCallAssignment,
    ZetkinMembership,
} from '../types/zetkin';

describe('CallAssignmentList', () => {
    let dummyCallAssignments : ZetkinCallAssignment[];
    let dummyMemberships : ZetkinMembership[];

    beforeEach(()=> {
        cy.fixture('dummyCallAssignments.json')
            .then((data : {data: ZetkinCallAssignment[]}) => {
                dummyCallAssignments = data.data;
            });
        cy.fixture('dummyMemberships.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyMemberships = data.data;
            });
    });

    it('contains data for each event', () => {
        mountWithProviders(
            <CallAssignmentList
                callAssignments={ dummyCallAssignments }
                memberships={ dummyMemberships }
            />,
        );

        cy.get('[data-testid="call-assignment"]').each((item) => {
            cy.wrap(item)
                .get('[data-testid="call-title"]').should('be.visible')
                .get('[data-testid="call-org"]').should('be.visible');
        });
    });

    it('shows a placeholder when the list is empty', () => {
        dummyCallAssignments = [];

        mountWithProviders(
            <CallAssignmentList
                callAssignments={ dummyCallAssignments }
                memberships={ dummyMemberships }
            />,
        );

        cy.contains('misc.callAssignmentList.placeholder');
    });

    it('shows a placeholder when the list is undefined', () => {
        mountWithProviders(
            <CallAssignmentList
                callAssignments={ undefined }
                memberships={ dummyMemberships }
            />,
        );

        cy.contains('misc.callAssignmentList.placeholder');
    });
});
