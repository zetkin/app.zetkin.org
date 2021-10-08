import { render, useRouterMock } from 'test-utils';

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

describe('CampaignActionButtons.tsx', () => {
    describe('Public campaign page button', () => {
        it('navigates to the correct url when clicked', () => {
            useRouterMock.mockImplementation(() => ({
                query: { orgId: 1 },
            }));
            render(<CampaignActionButtons campaign={ mockCampaign } />);
        } );
    });
});
