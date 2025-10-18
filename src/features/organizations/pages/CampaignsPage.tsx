'use client';

import { FC } from 'react';
import { Box, List } from '@mui/material';

import usePublicCampaigns from 'features/organizations/hooks/usePublicCampaigns';
import PublicCampaignListItem from 'features/organizations/components/PublicCampaignListItem';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';

type Props = {
  orgId: number;
};

const CampaignsPage: FC<Props> = ({ orgId }) => {
  const campaigns = usePublicCampaigns(orgId);
  const messages = useMessages(messageIds);

  if (campaigns.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
        }}
      >
        <ZUIText>{messages.projectsList.emptyList()}</ZUIText>
      </Box>
    );
  }

  return (
    <List>
      {campaigns.map((campaign, index) => {
        return (
          <PublicCampaignListItem
            key={index}
            campaign={campaign}
            orgId={orgId}
          />
        );
      })}
    </List>
  );
};

export default CampaignsPage;
