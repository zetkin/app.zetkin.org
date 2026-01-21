import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import { ZetkinCampaign } from 'utils/types/zetkin';
import oldTheme from 'theme';
import messageIds from '../l10n/messageIds';

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

  if (campaign.visibility == 'open') {
    return CampaignStatus.PUBLIC;
  }

  return CampaignStatus.PRIVATE;
};

const CampaignStatusChip: FC<{ campaign: ZetkinCampaign }> = ({ campaign }) => {
  const colors: Record<CampaignStatus, string> = {
    archived: oldTheme.palette.grey[500],
    draft: oldTheme.palette.grey[500],
    private: oldTheme.palette.statusColors.blue,
    public: oldTheme.palette.success.main,
  };

  const status = getCampaignStatus(campaign);

  return (
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
  );
};

export default CampaignStatusChip;
