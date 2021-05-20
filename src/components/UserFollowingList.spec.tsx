import { mountWithProviders } from '../utils/testing';
import UserFollowingList from './UserFollowingList';
import { ZetkinMembership } from '../types/zetkin';

describe('UserFollowingList', () => {
    let dummyFollowing : ZetkinMembership[];

    before(() => {
        cy.fixture('dummyFollowing.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyFollowing = data.data;
            });
    });

    it('contains data for each followed organization', () => {
        mountWithProviders(
            <UserFollowingList
                following={ dummyFollowing }
                onUnfollow={ () => null }
            />,
        );

        cy.get('[data-testid="following-list"]').each((item) => {
            cy.wrap(item)
                .get('[data-testid="org-avatar"]').should('be.visible')
                .get('[data-testid="org-title"]').should('be.visible')
                .get('[data-testid="user-role"]').should('be.visible');
        });
    });

    it('contains a placeholder if user has no role', () => {
        dummyFollowing[0].role = null;

        mountWithProviders(
            <UserFollowingList
                following={ dummyFollowing }
                onUnfollow={ () => null }
            />,
        );

        cy.get('[data-testid="following-item"]')
            .should('contain', 'pages.myOrgs.rolePlaceholder')
            .should('not.contain', 'undefined');
    });

    it('contains a placeholder if user does not follow any organizations', () => {
        mountWithProviders(
            <UserFollowingList
                following={ [] }
                onUnfollow={ () => null }
            />,
        );

        cy.contains('pages.myOrgs.orgsPlaceholder');
    });

    it('contains an unfollow button for each organization', () => {
        const spyOnSignup = cy.spy();

        mountWithProviders(
            <UserFollowingList
                following={ dummyFollowing }
                onUnfollow={ spyOnSignup }
            />,
        );

        cy.findByText('pages.myOrgs.unfollow')
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });

    it('contains links for each organization', () => {
        mountWithProviders(
            <UserFollowingList
                following={ dummyFollowing }
                onUnfollow={ () => null }
            />,
        );

        cy.get('a[href*="/o/"]').should('have.length', 1);
    });
});