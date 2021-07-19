import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getCampaign from '../../../fetching/getCampaign';
import TabbedLayout from './TabbedLayout';

interface SingleCampaignLayoutProps {
    fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({ children, fixedHeight }) => {
    const { campId, orgId } = useRouter().query;
    const campaignQuery = useQuery(['campaign', orgId, campId ], getCampaign(orgId  as string, campId as string));

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/campaigns/${campId}` }
            fixedHeight={ fixedHeight }
            subtitle="subtitle for single campaign tabs" //TODO: generate subtitle
            tabs={ [
                {  defaultTab: true, href: `/`, label: 'summary' },
                { href: `/calendar`, label: 'calendar' },
                { href: `/insights`, label: 'insights' },
            ] }
            title={ campaignQuery.data?.title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleCampaignLayout;
