import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import CampaignActionButtons from 'components/organize/campaigns/CampaignActionButtons';
import getCampaign from '../../../fetching/getCampaign';
import getCampaignEvents from '../../../fetching/getCampaignEvents';
import TabbedLayout from './TabbedLayout';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';

interface SingleCampaignLayoutProps {
    fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({ children, fixedHeight }) => {
    const { campId, orgId } = useRouter().query;
    const campaignQuery = useQuery(['campaign', orgId, campId ], getCampaign(orgId  as string, campId as string));
    const campaignEventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string));

    const campaign = campaignQuery.data;
    const campaignEvents = campaignEventsQuery.data || [];

    const [firstEvent, lastEvent] = getFirstAndLastEvent(campaignEvents);

    if (!campaign) return null;

    return (
        <TabbedLayout
            actionButtons={
                <CampaignActionButtons campaign={ campaign } />
            }
            baseHref={ `/organize/${orgId}/campaigns/${campId}` }
            defaultTab="/"
            fixedHeight={ fixedHeight }
            subtitle={ firstEvent && lastEvent ? (
                <>
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ removeOffset(firstEvent.start_time) }
                    />
                    { ` - ` }
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ removeOffset(lastEvent.end_time) }
                        year="numeric"
                    />
                </>
            ) : (
                <Msg id="pages.organizeCampaigns.indefinite" />
            ) }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.campaigns.summary' },
                { href: `/calendar`, messageId: 'layout.organize.campaigns.calendar' },
            ] }
            title={ campaign?.title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleCampaignLayout;
