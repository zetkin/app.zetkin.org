import React, { FC, useMemo } from 'react';
import { Person } from '@mui/icons-material';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';
import CardDescription from './CardDescription';

const PublicCampaignListItem: FC<{
  campaign: ZetkinCampaign;
  orgId: number;
}> = ({ orgId, campaign }) => {
  const href = `/o/${orgId}/projects/${campaign.id}/`;

  const content = useMemo(() => {
    const items: React.ReactElement[] = [];

    if (campaign.manager) {
      items.push(
        <ZUIIconLabel
          key={'manager'}
          color="secondary"
          icon={Person}
          label={campaign.manager?.name ?? ''}
          size="small"
        />
      );
    }

    if (campaign.info_text) {
      items.push(
        <CardDescription
          key={'info_text'}
          description={campaign.info_text}
          href={href}
        />
      );
    }

    return items;
  }, [href]);

  return <ZUIItemCard content={content} href={href} title={campaign.title} />;
};

export default PublicCampaignListItem;
