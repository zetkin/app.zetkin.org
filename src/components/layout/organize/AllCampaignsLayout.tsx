import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

interface AllCampaignsLayoutProps {
    fixedHeight?: boolean;
}

const AllCampaignsLayout: FunctionComponent<AllCampaignsLayoutProps> = ({ children, fixedHeight }) => {
    const { orgId } = useRouter().query;
    const intl = useIntl();

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/campaigns` }
            defaultTab="/"
            fixedHeight={ fixedHeight }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.campaigns.summary' },
                { href: `/calendar`, messageId: 'layout.organize.campaigns.calendar' },
                { href: `/archive`, messageId: 'layout.organize.campaigns.archive' },
            ] }
            title={ intl.formatMessage({ id: 'layout.organize.campaigns.allCampaigns' }) }>
            { children }
        </TabbedLayout>
    );
};

export default AllCampaignsLayout;
