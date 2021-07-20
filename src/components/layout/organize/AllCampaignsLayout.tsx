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
            fixedHeight={ fixedHeight }
            tabs={ [
                {  defaultTab: true, href: `/`, label: 'summary' },
                { href: `/calendar`, label: 'calendar' },
                { href: `/archive`, label: 'archive' },
            ] }
            title={ intl.formatMessage({ id: 'layout.organize.campaigns.allCampaigns' }) }>
            { children }
        </TabbedLayout>
    );
};

export default AllCampaignsLayout;
