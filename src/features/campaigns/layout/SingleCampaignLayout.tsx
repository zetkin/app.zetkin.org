import { FormattedDate } from 'react-intl';
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import CampaignActionButtons from 'features/campaigns/components/CampaignActionButtons';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getCampaignEvents from '../fetching/getCampaignEvents';
import { Msg } from 'core/i18n';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';

import messageIds from '../l10n/messageIds';

interface SingleCampaignLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { campId, orgId } = useRouter().query;
  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId as string, campId as string)
  );
  const campaignEventsQuery = useQuery(
    ['campaignEvents', orgId, campId],
    getCampaignEvents(orgId as string, campId as string)
  );

  const campaign = campaignQuery.data;
  const campaignEvents = campaignEventsQuery.data || [];

  const [firstEvent, lastEvent] = getFirstAndLastEvent(campaignEvents);

  if (!campaign) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<CampaignActionButtons campaign={campaign} />}
      baseHref={`/organize/${orgId}/campaigns/${campId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={
        firstEvent && lastEvent ? (
          <>
            <FormattedDate
              day="2-digit"
              month="long"
              value={removeOffset(firstEvent.start_time)}
            />
            {` - `}
            <FormattedDate
              day="2-digit"
              month="long"
              value={removeOffset(lastEvent.end_time)}
              year="numeric"
            />
          </>
        ) : (
          <Msg id={messageIds.indefinite} />
        )
      }
      tabs={[
        { href: `/`, messageId: 'layout.organize.campaigns.summary' },
        {
          href: `/calendar`,
          messageId: 'layout.organize.campaigns.calendar',
        },
      ]}
      title={campaign?.title}
    >
      {children}
    </TabbedLayout>
  );
};

export default SingleCampaignLayout;
