import singletonRouter from 'next/router';
import { fireEvent, render } from 'utils/testing';

import CampaignActionButtons from './CampaignActionButtons';

const mockCampaign = {
    color: 'green',
    id: 1,
    info_text: 'Mock campaign',
    manager: null,
    published: false,
    title: 'Mock Campaign',
    visibility: 'private',
};

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('CampaignActionButtons.tsx', () => {
    describe('Public campaign page button', () => {
        it('navigates to the correct url when clicked', () => {
            singletonRouter.query = {
                orgId: '1',
            };
            const { getByText } = render(<CampaignActionButtons campaign={ mockCampaign } />);
            fireEvent.click(getByText('pages.organizeCampaigns.linkGroup.public'));
            expect(singletonRouter).toMatchObject({
                asPath: '/o/1/campaigns/1',
            });
        } );
    });
});
