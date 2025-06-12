'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import NextLink from 'next/link';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import useFilteredCampaignEvents from 'features/campaigns/hooks/useFilteredCampaignEvents';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortlHeader';
import EventMapLayout from 'features/organizations/layouts/EventMapLayout';

type Props = {
  campaign: ZetkinCampaign;
  children: ReactNode;
};

const PublicProjectLayout: FC<Props> = ({ children, campaign }) => {
  const { filteredEvents } = useFilteredCampaignEvents(
    campaign.organization.id,
    campaign.id
  );

  return (
    <EventMapLayout
      events={filteredEvents}
      header={
        <ActivistPortalHeader
          subtitle={campaign.info_text}
          title={campaign.title}
          topLeftComponent={
            <NextLink href={`/o/${campaign.organization.id}`} passHref>
              <Box
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              >
                <ZUIOrgLogoAvatar
                  orgId={campaign.organization.id}
                  size="small"
                />
                <ZUIText>{campaign.organization.title}</ZUIText>
              </Box>
            </NextLink>
          }
        />
      }
    >
      {children}
    </EventMapLayout>
  );
};

export default PublicProjectLayout;
