'use client';

import { FC } from 'react';
import { List } from '@mui/material';

import usePublicCampaigns from 'features/organizations/hooks/usePublicCampaigns';
import PublicCampaignListItem from 'features/organizations/components/PublicCampaignListItem';

type Props = {
  orgId: number;
};

const CampaignsPage: FC<Props> = ({ orgId }) => {
  const campaigns = usePublicCampaigns(orgId);

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
