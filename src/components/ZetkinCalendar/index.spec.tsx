import * as Router from 'next/router';
import { mountWithProviders } from '../../utils/testing';
import ZetkinCalendar from '.';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from '../../types/zetkin';

describe('ZetkinCalendar', () => {
    let dummyCampaigns: ZetkinCampaign[];
    let dummyEvents: ZetkinEvent[];
    let dummyTasks: ZetkinTask[];

    beforeEach(() => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]`, prefetch: async () => null, query: { orgId: 1 } };
        });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data.data;
            });
        cy.fixture('dummyCampaigns.json')
            .then((data: { data: ZetkinCampaign[] }) => {
                dummyCampaigns = data.data;
            });
        cy.fixture('dummyTasks.json')
            .then((data: { data: ZetkinTask[] }) => {
                dummyTasks = data.data;
            });
    });

    it('shows back and forward widget buttons', () => {
        mountWithProviders(
            <ZetkinCalendar baseHref="" campaigns={ dummyCampaigns } events={ dummyEvents } tasks={ dummyTasks }/>,
        );
        cy.get('[data-testid="back-button"]').should('be.visible');
        cy.get('[data-testid="fwd-button"]').should('be.visible');
    });
});
