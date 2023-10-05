import { FormattedDate } from 'react-intl';
import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';

import CampaignActionButtons from 'features/campaigns/components/CampaignActionButtons';
import EditableCampaignTitle from '../components/EditableCampaignTitle';
import getCampaignEvents from '../fetching/getCampaignEvents';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useCampaign from '../hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';

interface SingleCampaignLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, campId } = useNumericRouteParams();
  const campaignEventsQuery = useQuery(
    ['campaignEvents', orgId, campId],
    getCampaignEvents(orgId.toString(), campId.toString())
  );

  const { data: campaign } = useCampaign(orgId, campId);
  const campaignEvents = campaignEventsQuery.data || [];

  const [firstEvent, lastEvent] = getFirstAndLastEvent(campaignEvents);

  if (!campaign) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={<CampaignActionButtons campaign={campaign} />}
      baseHref={`/organize/${orgId}/projects/${campId}`}
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
        { href: `/`, label: messages.layout.overview() },
        {
          href: `/calendar`,
          label: messages.layout.calendar(),
        },
        {
          href: '/activities',
          label: messages.layout.activities(),
        },
        {
          href: '/archive',
          label: messages.layout.archive(),
        },
      ]}
      title={<EditableCampaignTitle campaign={campaign} />}
    >
      {children}
    </TabbedLayout>
  );
};

export default SingleCampaignLayout;
