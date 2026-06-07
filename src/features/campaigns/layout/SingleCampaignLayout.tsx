import { useFormatter } from 'next-intl';
import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import CampaignActionButtons from 'features/campaigns/components/CampaignActionButtons';
import EditableCampaignTitle from '../components/EditableCampaignTitle';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useCampaign from '../hooks/useCampaign';
import useCampaignEvents from '../hooks/useCampaignEvents';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import CampaignStatusChip from '../components/CampaignStatusChip';

interface SingleCampaignLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const SingleCampaignLayout: FunctionComponent<SingleCampaignLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const format = useFormatter();
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const { firstEvent, lastEvent } = useCampaignEvents(orgId, campId);

  const campaign = campaignFuture.data;

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
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <CampaignStatusChip campaign={campaign} />
          <Box>
            {firstEvent && lastEvent ? (
              <>
                {format.dateTime(
                  new Date(removeOffset(firstEvent.start_time)),
                  {
                    day: '2-digit',
                    month: 'long',
                  }
                )}
                {` - `}
                {format.dateTime(new Date(removeOffset(lastEvent.end_time)), {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </>
            ) : (
              <Msg id={messageIds.indefinite} />
            )}
          </Box>
        </Box>
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
