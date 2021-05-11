import { mountWithProviders } from '../../utils/testing';
import OrgHeader from './OrgHeader';
import { UserContext } from '../../hooks';
import {
    ZetkinMembership,
    ZetkinOrganization,
} from '../../types/zetkin';

describe('OrgHeader', () => {
    let dummyOrg : ZetkinOrganization;
    let dummyFollowing : ZetkinMembership[];

    const dummyUser = {
        first_name: 'Firstname',
        id: 100,
        last_name: 'Lastname',
        username: 'Username',
    };

    before(()=> {
        cy.fixture('dummyOrg.json')
            .then((data : ZetkinOrganization) => {
                dummyOrg = data;
            });
        cy.fixture('dummyFollowing.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyFollowing = data.data;
            });
    });

    it('contains a follow button if user is logged in and not following', () => {
        const spyOnSignup = cy.spy();
        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <OrgHeader
                    following={ [] }
                    onFollow={ spyOnSignup }
                    onUnfollow={ () => null }
                    org={ dummyOrg }
                />
            </UserContext.Provider>,
        );

        cy.findByText('layout.org.actions.follow')
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });

    it('contains a unfollow button if user is logged in and following', () => {
        const spyOnSignup = cy.spy();
        mountWithProviders(
            <UserContext.Provider value={ dummyUser }>
                <OrgHeader
                    following={ dummyFollowing }
                    onFollow={ () => null }
                    onUnfollow={ spyOnSignup }
                    org={ dummyOrg }
                />
            </UserContext.Provider>,
        );

        cy.findByText('layout.org.actions.unfollow')
            .click()
            .then(() => {
                expect(spyOnSignup).to.be.calledOnce;
            });
    });
});