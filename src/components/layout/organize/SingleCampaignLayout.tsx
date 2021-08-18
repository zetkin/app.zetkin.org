import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import CampaignActionButtons from 'components/organize/campaigns/CampaignActionButtons';
import getCampaign from '../../../fetching/getCampaign';
import getCampaignEvents from '../../../fetching/getCampaignEvents';
import { getNaiveDate } from '../../../utils/dateUtils';
import TabbedLayout from './TabbedLayout';

interface SingleCampaignLayoutProps {
    fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({ children, fixedHeight }) => {
    const { campId, orgId } = useRouter().query;
    const campaignQuery = useQuery(['campaign', orgId, campId ], getCampaign(orgId  as string, campId as string));
    const campaignEventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string));

    const campaign = campaignQuery.data;
    const campaignEvents = campaignEventsQuery.data || [];

    let endDate, startDate;
    const firstEvent = campaignEvents[0];
    const lastEvent = campaignEvents[campaignEvents.length - 1];
    if (firstEvent && lastEvent) {
        startDate = getNaiveDate(firstEvent.start_time) ;
        endDate = getNaiveDate(lastEvent.end_time);
    }

    if (!campaign) return null;

    return (
        <TabbedLayout
            actionButtons={
                <CampaignActionButtons campaign={ campaign } />
            }
            baseHref={ `/organize/${orgId}/campaigns/${campId}` }
            defaultTab="/"
            fixedHeight={ fixedHeight }
            subtitle={ startDate && endDate ? (
                <>
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ startDate }
                    />
                    { ` - ` }
                    <FormattedDate
                        day="2-digit"
                        month="long"
                        value={ endDate }
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
