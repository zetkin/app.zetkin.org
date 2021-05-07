import CallAssignmentList from './CallAssignmentList';
import { mountWithProviders } from '../utils/testing';
import { ZetkinCallAssignment } from '../types/zetkin';

describe('CallAssignmentList', () => {
    let dummyCallAssignments : ZetkinCallAssignment[];

    beforeEach(()=> {
        cy.fixture('dummyCallAssignments.json')
            .then((data : {data: ZetkinCallAssignment[]}) => {
                dummyCallAssignments = data.data;
            });
    });

    it('contains data for each assignment', () => {
        mountWithProviders(
            <CallAssignmentList
                callAssignments={ dummyCallAssignments }
            />,
        );

        cy.get('[data-testid="call-assignment"]').each((item) => {
            cy.wrap(item)
                .get('[data-testid="call-assignment-title"]').should('be.visible')
                .get('[data-testid="call-assignment-org"]').should('be.visible');
        });
    });
});
