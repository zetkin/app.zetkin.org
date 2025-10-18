import React, { FC, useMemo } from 'react';
import { Person } from '@mui/icons-material';
import { Box } from '@mui/material';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIItemCard from 'zui/components/ZUIItemCard';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import ZUIButton from 'zui/components/ZUIButton';
import messageIds from 'features/organizations/l10n/messageIds';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';

const PublicCampaignListItem: FC<{
  campaign: ZetkinCampaign;
  orgId: number;
}> = ({ orgId, campaign }) => {
  const messages = useMessages(messageIds);

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
        <Box key={'info_text'}>
          <Box
            sx={{
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              display: '-webkit-box',
              overflow: 'hidden',
            }}
          >
            <ZUIText color={'primary'} variant={'bodySmRegular'}>
              {campaign.info_text}
            </ZUIText>
          </Box>
          <ZUIButton
            href={href}
            label={messages.allEventsList.descriptionReadMore()}
          />
        </Box>
      );
    }

    return items;
  }, [messages, href]);

  return <ZUIItemCard content={content} href={href} title={campaign.title} />;
};

export default PublicCampaignListItem;
