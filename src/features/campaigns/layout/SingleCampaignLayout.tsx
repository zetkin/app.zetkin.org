import { FormattedDate } from 'react-intl';
import { FunctionComponent } from 'react';

import CampaignActionButtons from 'features/campaigns/components/CampaignActionButtons';
import EditableCampaignTitle from '../components/EditableCampaignTitle';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useCampaign from '../hooks/useCampaign';
import useCampaignEvents from '../hooks/useCampaignEvents';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';

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
  const { data: campaign } = useCampaign(orgId, campId);
  const { firstEvent, lastEvent } = useCampaignEvents(orgId, campId);

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
