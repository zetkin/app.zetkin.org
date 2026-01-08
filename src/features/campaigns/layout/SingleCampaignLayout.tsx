import { FormattedDate } from 'react-intl';
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
import { ZetkinCampaign } from 'utils/types/zetkin';
import oldTheme from 'theme';

enum CampaignStatus {
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PRIVATE = 'private',
  PUBLIC = 'public',
}

const getCampaignStatus = (campaign: ZetkinCampaign): CampaignStatus => {
  if (campaign.archived) {
    return CampaignStatus.ARCHIVED;
  }

  if (!campaign.published) {
    return CampaignStatus.DRAFT;
  }

  if (campaign.visibility == 'public') {
    return CampaignStatus.PUBLIC;
  }

  //Campaign visibility must be "private"
  return CampaignStatus.PRIVATE;
};

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
  const { campaignFuture } = useCampaign(orgId, campId);
  const { firstEvent, lastEvent } = useCampaignEvents(orgId, campId);

  const campaign = campaignFuture.data;

  const colors: Record<CampaignStatus, string> = {
    archived: oldTheme.palette.grey[500],
    draft: oldTheme.palette.grey[500],
    private: oldTheme.palette.statusColors.blue,
    public: oldTheme.palette.success.main,
  };

  if (!campaign) {
    return null;
  }

  const status = getCampaignStatus(campaign);

  return (
    <TabbedLayout
      actionButtons={<CampaignActionButtons campaign={campaign} />}
      baseHref={`/organize/${orgId}/projects/${campId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: colors[status],
              borderRadius: '2em',
              color: 'white',
              display: 'inline-flex',
              fontSize: 14,
              fontWeight: 'bold',
              padding: '0.5em 0.7em',
            }}
          >
            <Msg id={messageIds.singleProject.status[status]} />
          </Box>
          <Box>
            {firstEvent && lastEvent ? (
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
